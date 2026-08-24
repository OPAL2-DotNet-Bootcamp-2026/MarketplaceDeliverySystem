using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MarketplaceDeliverySystem.Controllers
{
    [ApiController]
    [Route("delivery")]
    public class DeliveryController : ControllerBase
    {
        private readonly DeliveryService _deliveryService;

        public DeliveryController(DeliveryService deliveryService)
        {
            _deliveryService = deliveryService;
        }

        // Only Admin can assign a driver.
        // PUT: /delivery/assign-driver?deliveryId=1&driverId=2
        [Authorize(Roles = "Admin")]
        [HttpPut("assign-driver")]
        public IActionResult AssignDriverToDelivery(
            [FromQuery] int deliveryId,
            [FromQuery] int driverId)
        {
            DriverAssignToDeliveryOutputDTO? result =
                _deliveryService.AssignDriverToDelivery(
                    deliveryId,
                    driverId);

            if (result == null)
            {
                return BadRequest(new
                {
                    Message =
                        "Driver could not be assigned. Check the delivery, order status, and driver availability."
                });
            }

            return Ok(result);
        }

        // Only the Driver can update the delivery status.
        // PUT: /delivery/1/status
        [Authorize(Roles = "Driver")]
        [HttpPut("{deliveryId}/status")]
        public IActionResult UpdateDeliveryStatus(
            int deliveryId,
            [FromBody] UpdateOrderStatusDTO dto)
        {
            MessageOutputDTO result =
                _deliveryService.UpdateDeliveryStatus(
                    deliveryId,
                    dto);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
        [Authorize(Roles = "Driver")]
        [HttpGet("my-delivery")]
        public IActionResult GetMyDelivery()
        {
            string? userIdValue =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdValue))
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdValue);

            var delivery = _deliveryService.GetMyDelivery(userId);

            if (delivery == null)
            {
                return NotFound(new
                {
                    Message = "No active delivery was found."
                });
            }

            return Ok(new
            {
                DeliveryId = delivery.DeliveryId,
                OrderId = delivery.OrderId,
                DeliveryStatus = delivery.DeliveryStatus,
                OrderStatus = delivery.Order.Status
            });
        }
    }
}