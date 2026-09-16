using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MarketplaceDeliverySystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BusinessCategoryController : ControllerBase
    {
        private readonly BusinessCategoryService _businessCategoryService;

        public BusinessCategoryController(BusinessCategoryService businessCategoryService)
        {
            _businessCategoryService = businessCategoryService;
        }

        [HttpGet("GetSidebarCategories")]
        [AllowAnonymous]
        public IActionResult GetSidebarCategories()
        {
            var result = _businessCategoryService.GetSidebarCategories();
            return Ok(result);
        }

    }
}
