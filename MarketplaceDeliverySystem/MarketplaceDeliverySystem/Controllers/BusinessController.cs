using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Mvc;

namespace MarketplaceDeliverySystem.Controllers
{
    [ApiController]
    //[controller] to declare the controller name automatically 
    [Route("api/[controller]")]
    public class BusinessController : ControllerBase
    {
        private readonly BusinessService _businessService;

        public BusinessController(BusinessService businessService)
        {
            _businessService = businessService;
        }

        [HttpPost("Register")]
        public IActionResult Register([FromBody]BusinessRegInputDTO dto)
        {
            _businessService.RegisterBusiness(dto);

            return Ok("Business registered successfully.");
        }
    }
}
