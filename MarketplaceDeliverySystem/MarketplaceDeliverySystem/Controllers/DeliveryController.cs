using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Mvc;

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

        // PUT: /delivery/assign-driver
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
                    Message = "Driver could not be assigned. Check the delivery, order status, and driver availability."
                });
            }

            return Ok(result);
        }
    }
}
