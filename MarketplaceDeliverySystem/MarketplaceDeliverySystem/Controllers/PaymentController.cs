using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;

namespace MarketplaceDeliverySystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Customer")]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentService _paymentService;

        public PaymentController(PaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        // POST: api/Payment/checkout
        // Creates a Thawani checkout session and returns the URL to redirect the customer to.
        [EnableRateLimiting("orderPolicy")]
        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] PaymentCheckoutDTO dto)
        {
            if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            {
                return Unauthorized();
            }

            PaymentCheckoutOutputDTO result =
                await _paymentService.CreateCheckoutSessionAsync(dto.OrderId, userId);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        // GET: api/Payment/verify/5
        // Checks with Thawani whether the order was really paid.
        [EnableRateLimiting("orderPolicy")]
        [HttpGet("verify/{orderId}")]
        public async Task<IActionResult> Verify(int orderId)
        {
            if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            {
                return Unauthorized();
            }

            PaymentVerifyOutputDTO result =
                await _paymentService.VerifyPaymentAsync(orderId, userId);

            return Ok(result);
        }
    }
}
