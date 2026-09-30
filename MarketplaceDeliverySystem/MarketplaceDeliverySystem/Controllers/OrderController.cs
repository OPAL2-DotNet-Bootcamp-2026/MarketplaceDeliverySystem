using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;
namespace MarketplaceDeliverySystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrderController(OrderService orderService)
        {
            _orderService = orderService;
        }

        // POST: /order/create
        //Change the endpoint to async
        [Authorize(Roles ="Customer")]
        [EnableRateLimiting("orderPolicy")]
        [HttpPost("CreateOrder")]
        public async Task<IActionResult> CreateOrder(
            [FromBody] OrderCreateDTO dto)
        {
            string? userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdValue))
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdValue);

            Order? order =
                await _orderService.CreateOrderAsync(dto, userId);

            if (order == null)
            {
                return BadRequest(new
                {
                    Message = LocalizedText.Choose("Order could not be created.", "تعذر إنشاء الطلب.")
                });
            }

            return Ok(new
            {
                Message = LocalizedText.Choose("Order created successfully.", "تم إنشاء الطلب بنجاح."),
                OrderId = order.OrderId,
                TotalAmount = order.TotalAmount,
                Status = order.Status
            });
        }

        // PUT: /order/cancel
        [Authorize(Roles = "Customer")]
        [HttpPut("cancel")]
        public IActionResult CancelOrder([FromBody] OrderCancelDTO dto)
        {
            string? userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdValue, out int userId))
            {
                return Unauthorized();
            }

            MessageOutputDTO result =
                _orderService.CancelOrder(dto, userId);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [Authorize(Roles = "Customer")]
        [HttpGet("GetOrderById/{orderId}")]
        public IActionResult GetOrderById(int orderId)
        {
            string? userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdValue, out int userId))
            {
                return Unauthorized();
            }

            var order = _orderService.GetOrderById(orderId, userId);

            if (order == null)
                return NotFound(LocalizedText.Choose("Order not found.", "لم يتم العثور على الطلب."));

            return Ok(order);
        }

        [Authorize(Roles = "Customer")]
        [HttpGet("GetMyActiveOrders")]
        public IActionResult GetMyActiveOrders()
        {
            //The controller gets ClaimTypes.NameIdentifier which is your UserId
            string? userIdValue =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdValue, out int userId))
            {
                return Unauthorized();
            }

            List<OrderDetailsDTO> orders =
                _orderService.GetMyActiveOrders(userId);

            return Ok(orders);
        }

        [Authorize(Roles = "Customer")]
        [HttpGet("GetMyOrderHistory")]
        public IActionResult GetMyOrderHistory()
        {
            string? userIdValue =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdValue, out int userId))
            {
                return Unauthorized();
            }

            List<OrderDetailsDTO> orders =
                _orderService.GetMyOrderHistory(userId);

            return Ok(orders);
        }
    }
}
