using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Authorization;
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

        [HttpGet("GetBestProductForEachBusiness")]
        [Authorize(Roles = "Customer")]
        public IActionResult GetBestProductForEachBusiness()
        {
            List<BestProductDTO> bestProducts =
                _businessService.GetBestProductForEachBusiness();

            return Ok(bestProducts);
        }
        [HttpGet("GetAllBusinessesWithProducts")]
        [Authorize(Roles = "Customer")]
        public IActionResult GetAllBusinessesWithProducts()
        {
            List<BusinessWithProductsRespDTO> businesses =
                _businessService.GetAllBusinessesWithProducts();

            return Ok(businesses);
        }

        [HttpGet("GetAllBusinesses")]
        [Authorize(Roles = "Customer")]
        public IActionResult GetAllBusinesses([FromQuery] int? categoryId = null)
        {
            List<BusinessCardRespDTO> result = _businessService.GetAllBusinesses(categoryId);
            return Ok(result);
        }

        [HttpGet("GetPopularBusinesses")]
        [AllowAnonymous]
        public IActionResult GetPopularBusinesses([FromQuery] int limit = 4)
        {
            List<PopularBusinessDTO> result = _businessService.GetPopularBusinesses(limit);
            return Ok(result);
        }
    }
}
