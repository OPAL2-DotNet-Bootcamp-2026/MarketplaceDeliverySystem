namespace MarketplaceDeliverySystem.DTOs
{
    public class PaymentCheckoutOutputDTO
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? CheckoutUrl { get; set; }
        public bool TestMode { get; set; }
    }
}
