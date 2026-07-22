using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Mvc;

namespace MarketplaceDeliverySystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _productService;

        public ProductController(ProductService productService)
        {
            _productService = productService;
        }

        [HttpPut("update")]
        public IActionResult UpdateProduct(ProductUpdateDTO dto)
        {
            _productService.UpdateProduct(dto);

            return Ok("Product updated successfully.");
        }
    }
}
