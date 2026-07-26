using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MarketplaceDeliverySystem.Controllers
{
    [ApiController]
    [Route("order")]
    [Authorize(Roles = "Customer")]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrderController(OrderService orderService)
        {
            _orderService = orderService;
        }

        // POST: /order/create
        //Change the endpoint to async
        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder(
    [FromBody] OrderCreateDTO dto)
        {
            Order? order =
                await _orderService.CreateOrderAsync(dto);

            if (order == null)
            {
                return BadRequest(new
                {
                    Message = "Order could not be created."
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

        [HttpGet("GetOrderById/{orderId}")]
        public IActionResult GetOrderById(int orderId)
        {
            var order = _orderService.GetOrderById(orderId);

            if (order == null)
                return NotFound("Order not found.");

            return Ok(order);
        }
    }
}