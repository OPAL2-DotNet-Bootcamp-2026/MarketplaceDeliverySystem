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

        [HttpPost("Register")]
        public IActionResult Register(DriverRegDTO dto)
        {
            UserResponseDTO response = _driverService.Register(dto);

            if (response == null)
                return BadRequest("Email already exists.");

            return Ok(response);
        }
    }
    }
