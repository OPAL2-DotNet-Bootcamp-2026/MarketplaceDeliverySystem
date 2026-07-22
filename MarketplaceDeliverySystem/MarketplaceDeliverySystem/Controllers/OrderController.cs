using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Mvc;

namespace MarketplaceDeliverySystem.Controllers
{
    [ApiController]
    [Route("order")]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrderController(OrderService orderService)
        {
            _orderService = orderService;
        }

        // POST: /order/create
        [HttpPost("create")]
        public IActionResult CreateOrder([FromBody] OrderCreateDTO dto)
        {
            Order? order = _orderService.CreateOrder(dto);

            if (order == null)
            {
                return BadRequest(new
                {
                    Message = "Order could not be created. Check the customer, business, products, availability, and stock."
                });
            }

            return Ok(new
            {
                Message = "Order created successfully.",
                OrderId = order.OrderId,
                TotalAmount = order.TotalAmount,
                Status = order.Status
            });
        }

        // PUT: /order/cancel
        [HttpPut("cancel")]
        public IActionResult CancelOrder([FromBody] OrderCancelDTO dto)
        {
            MessageOutputDTO result =
                _orderService.CancelOrder(dto);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}