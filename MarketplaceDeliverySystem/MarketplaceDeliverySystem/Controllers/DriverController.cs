using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
namespace MarketplaceDeliverySystem.Controllers
{
    
        [ApiController]

    [Route("api/[controller]")]
    [Authorize]
    public class DriverController : ControllerBase
        {
            private readonly DriverService _driverService;

            public DriverController(DriverService driverService)
            {
                _driverService = driverService;
            }
        // Registration is public, but limited to prevent repeated requests.
        [AllowAnonymous]
        [EnableRateLimiting("authenticationPolicy")]
        [HttpPost("Register")]
        //[Authorize(Roles ="Driver")]
        public IActionResult Register(DriverRegDTO dto)
        {
            UserResponseDTO response = _driverService.Register(dto);

            if (response == null)
                return BadRequest("Email already exists.");

            return Ok(response);
        }
    }
    }
