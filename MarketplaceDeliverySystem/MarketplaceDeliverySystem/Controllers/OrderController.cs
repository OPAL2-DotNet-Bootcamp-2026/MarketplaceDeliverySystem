using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Mvc;

namespace MarketplaceDeliverySystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrderController(
            OrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPut("UpdateStatus/{orderId}")]
        public IActionResult UpdateStatus(
            int orderId,
            [FromBody] UpdateOrderStatusDTO dto)
        {
            try
            {
                UpdateOrderStatusOutputDTO result =
                    _orderService.UpdateOrderStatus(
                        orderId,
                        dto);

                return Ok(result);
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }
    }
}