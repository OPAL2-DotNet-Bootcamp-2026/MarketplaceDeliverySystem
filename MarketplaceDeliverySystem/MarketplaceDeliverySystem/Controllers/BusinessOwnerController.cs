using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MarketplaceDeliverySystem.Controllers
{
    

        [ApiController]
        [Route("api/[controller]")]
        [Authorize]
        public class BusinessOwnerController : ControllerBase
        {
            private readonly BusinessOwnerService _businessOwnerService;

            public BusinessOwnerController(BusinessOwnerService businessOwnerService)
            {
                _businessOwnerService = businessOwnerService;
            }

            [HttpPost("RegisterBusinessOwner")]
            public IActionResult Register(RegBusinessOwnerDTO dto)
            {
                _businessOwnerService.RegisterBusinessOwner(dto);
                return Ok("Business Owner registered successfully.");
            }
        }
    }

