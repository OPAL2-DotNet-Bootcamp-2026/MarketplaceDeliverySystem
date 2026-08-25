using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MarketplaceDeliverySystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryService _categoryService;

        public CategoryController(CategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet("GetSidebarCategories")]
        [AllowAnonymous]
        public IActionResult GetSidebarCategories()
        {
            var result = _categoryService.GetSidebarCategories();
            return Ok(result);
        }
    }
}
