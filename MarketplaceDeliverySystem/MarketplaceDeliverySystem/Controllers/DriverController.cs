using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace MarketplaceDeliverySystem.Controllers
{
    
        [ApiController]
        [Route("driver")]
        public class DriverController : ControllerBase
        {
            private readonly DriverService _driverService;

            public DriverController(DriverService driverService)
            {
                _driverService = driverService;
            }
        [AllowAnonymous] //Anyone can register without a token.
        [HttpPost("register")]
            public IActionResult RegisterDriver([FromBody] DriverRegDTO dto)
            {
                Driver? driver = _driverService.RegisterDriver(dto);

                if (driver == null)
                {
                    return BadRequest("Driver could not be registered.");
                }

                return Ok(new
                {
                    DriverId = driver.DriverId,
                    Message = "Driver registered successfully."
                });
            }
        }
    }
