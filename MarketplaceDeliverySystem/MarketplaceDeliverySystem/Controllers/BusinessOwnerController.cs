using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Mvc;

namespace MarketplaceDeliverySystem.Controllers
{
    

        [ApiController]
        [Route("api/[controller]")]
        public class BusinessOwnerController : ControllerBase
        {
            private readonly BusinessOwnerService _businessOwnerService;

            public BusinessOwnerController(BusinessOwnerService businessOwnerService)
            {
                _businessOwnerService = businessOwnerService;
            }

            [HttpPost("Register")]
            public IActionResult Register(RegBusinessOwnerDTO dto)
            {
                _businessOwnerService.Register(dto);
                return Ok("Business Owner registered successfully.");
            }
        }
    }

