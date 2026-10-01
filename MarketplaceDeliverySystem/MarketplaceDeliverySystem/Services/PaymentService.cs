using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Repos;
using MarketplaceDeliverySystem.Settings;
using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace MarketplaceDeliverySystem.Services
{
    // Talks to Thawani Pay (hosted checkout).
    // Flow: create session -> customer pays on Thawani -> we verify the session.
    public class PaymentService
    {
        private const int MaxProductNameLength = 40; // Thawani limit

        // Thawani session ids look like "checkout_AbC123...". Checked before the id
        // is placed in a URL path.
        private static readonly Regex SessionIdPattern =
            new(@"^checkout_[A-Za-z0-9]{10,100}$", RegexOptions.Compiled);

        private readonly HttpClient _http;
        private readonly ThawaniSettings _settings;
        private readonly PaymentRepo _paymentRepo;
        private readonly OrderRepo _orderRepo;
        private readonly ILogger<PaymentService> _logger;

        public PaymentService(
            HttpClient http,
            IOptions<ThawaniSettings> settings,
            PaymentRepo paymentRepo,
            OrderRepo orderRepo,
            ILogger<PaymentService> logger)
        {
            _settings = settings.Value;
            _http = http;
            _paymentRepo = paymentRepo;
            _orderRepo = orderRepo;
            _logger = logger;

            _http.BaseAddress = new Uri(_settings.BaseUrl);
            _http.DefaultRequestHeaders.Add("thawani-api-key", _settings.SecretKey);
        }

        public async Task<PaymentCheckoutOutputDTO> CreateCheckoutSessionAsync(
            int orderId, int userId)
        {
            if (string.IsNullOrWhiteSpace(_settings.SecretKey) ||
                string.IsNullOrWhiteSpace(_settings.PublishableKey))
            {
                _logger.LogError("Thawani keys are not configured (TestMode={Mode}).",
                    _settings.UseTestMode);
                return CheckoutFail("Online payment is not configured.");
            }

            // Only the order owner can pay it.
            Order? order = _orderRepo.GetForPayment(orderId, userId);

            if (order == null)
            {
                return CheckoutFail("Order not found.");
            }

            if (order.Status == "Cancelled")
            {
                return CheckoutFail("Cancelled order cannot be paid.");
            }

            Payment? payment = order.Payment;

            if (payment == null)
            {
                return CheckoutFail("Payment record not found.");
            }

            if (payment.PaymentStatus == "Paid")
            {
                return CheckoutFail("Order is already paid.");
            }

            // Price comes from our DB, never from the client. Thawani wants baisa (1 OMR = 1000).
            var products = order.OrderItems.Select(item => new
            {
                name = Truncate(item.Product.ProductName),
                quantity = item.Quantity,
                unit_amount = ToBaisa(item.UnitPrice)
            }).ToList();

            if (order.DeliveryFee > 0)
            {
                products.Add(new
                {
                    name = "Delivery fee",
                    quantity = 1,
                    unit_amount = ToBaisa(order.DeliveryFee)
                });
            }

            string returnBase = _settings.FrontendBaseUrl.TrimEnd('/');

            var body = new
            {
                client_reference_id = order.OrderId.ToString(),
                mode = "payment",
                products,
                success_url = $"{returnBase}/PaymentResult.html?orderId={order.OrderId}&status=success",
                cancel_url = $"{returnBase}/PaymentResult.html?orderId={order.OrderId}&status=cancelled",
                metadata = new { order_id = order.OrderId.ToString() }
            };

            try
            {
                HttpResponseMessage response =
                    await _http.PostAsJsonAsync("/api/v1/checkout/session", body);
                string raw = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Thawani create session failed: {Status} {Body}",
                        (int)response.StatusCode, raw);
                    return CheckoutFail("Could not start online payment.");
                }

                using JsonDocument doc = JsonDocument.Parse(raw);
                string? sessionId = doc.RootElement
                    .GetProperty("data")
                    .GetProperty("session_id")
                    .GetString();

                if (string.IsNullOrEmpty(sessionId))
                {
                    _logger.LogError("Thawani returned no session_id: {Body}", raw);
                    return CheckoutFail("Could not start online payment.");
                }

                // The session id is not stored in our DB (no schema change). The browser
                // keeps it and sends it back to verify, which re-checks it with Thawani.
                return new PaymentCheckoutOutputDTO
                {
                    Success = true,
                    Message = "Checkout session created.",
                    SessionId = sessionId,
                    CheckoutUrl =
                        $"{_settings.BaseUrl}/pay/{sessionId}?key={_settings.PublishableKey}",
                    TestMode = _settings.UseTestMode
                };
            }
            catch (Exception ex) when (ex is HttpRequestException ||
                                       ex is JsonException ||
                                       ex is KeyNotFoundException ||
                                       ex is TaskCanceledException)
            {
                _logger.LogError(ex, "Thawani create session error.");
                return CheckoutFail("Could not reach the payment provider.");
            }
        }

        // Asks Thawani for the real session state. Never trust the redirect URL alone.
        public async Task<PaymentVerifyOutputDTO> VerifyPaymentAsync(
            int orderId, int userId, string? sessionId)
        {
            Order? order = _orderRepo.GetForPayment(orderId, userId);

            if (order?.Payment == null)
            {
                return VerifyFail(orderId, "Order not found.");
            }

            Payment payment = order.Payment;

            // Already confirmed earlier (verify can be called more than once).
            if (payment.PaymentStatus == "Paid")
            {
                return new PaymentVerifyOutputDTO
                {
                    Success = true,
                    Message = "Payment confirmed.",
                    OrderId = orderId,
                    PaymentStatus = payment.PaymentStatus
                };
            }

            if (string.IsNullOrEmpty(sessionId) || !SessionIdPattern.IsMatch(sessionId))
            {
                return VerifyFail(orderId, "No online payment was started for this order.");
            }

            try
            {
                HttpResponseMessage response = await _http.GetAsync(
                    $"/api/v1/checkout/session/{sessionId}");
                string raw = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Thawani get session failed: {Status} {Body}",
                        (int)response.StatusCode, raw);
                    return VerifyFail(orderId, "Could not verify the payment.");
                }

                using JsonDocument doc = JsonDocument.Parse(raw);
                JsonElement data = doc.RootElement.GetProperty("data");
                string? thawaniStatus = data.GetProperty("payment_status").GetString();
                string? reference = data.GetProperty("client_reference_id").GetString();
                int paidBaisa = data.GetProperty("total_amount").GetInt32();

                // The session must be one we created for THIS order and for THIS amount.
                // Stops a paid session of another order being used to mark this one paid.
                if (reference != order.OrderId.ToString() ||
                    paidBaisa != ToBaisa(order.TotalAmount))
                {
                    _logger.LogWarning(
                        "Thawani session {Session} does not match order {Order}.",
                        sessionId, order.OrderId);
                    return VerifyFail(orderId, "Payment does not match this order.");
                }

                if (thawaniStatus == "paid")
                {
                    payment.PaymentStatus = "Paid";
                    payment.PaymentDate = DateTime.UtcNow;
                    _paymentRepo.Update();

                    return new PaymentVerifyOutputDTO
                    {
                        Success = true,
                        Message = "Payment confirmed.",
                        OrderId = orderId,
                        PaymentStatus = payment.PaymentStatus
                    };
                }

                // "unpaid" or "cancelled": leave the payment as Pending.
                return new PaymentVerifyOutputDTO
                {
                    Success = false,
                    Message = "Payment was not completed.",
                    OrderId = orderId,
                    PaymentStatus = payment.PaymentStatus
                };
            }
            catch (Exception ex) when (ex is HttpRequestException ||
                                       ex is JsonException ||
                                       ex is KeyNotFoundException ||
                                       ex is TaskCanceledException)
            {
                _logger.LogError(ex, "Thawani verify error.");
                return VerifyFail(orderId, "Could not reach the payment provider.");
            }
        }

        private static int ToBaisa(decimal omr) => (int)Math.Round(omr * 1000m);

        private static string Truncate(string name) =>
            name.Length <= MaxProductNameLength ? name : name[..MaxProductNameLength];

        private PaymentCheckoutOutputDTO CheckoutFail(string message) => new()
        {
            Success = false,
            Message = message,
            TestMode = _settings.UseTestMode
        };

        private static PaymentVerifyOutputDTO VerifyFail(int orderId, string message) => new()
        {
            Success = false,
            Message = message,
            OrderId = orderId,
            PaymentStatus = "Pending"
        };
    }
}
