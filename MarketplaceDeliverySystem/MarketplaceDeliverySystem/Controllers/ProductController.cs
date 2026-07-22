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

        [HttpPut("update/{id}")]
        public IActionResult UpdateProduct(int id, UpdateProductDTO dto)
        {
            ProductUpdatedRespDTO updated = _productService.UpdateProduct(id,dto);
            if (updated == null)
            {
                return NotFound("Product not found.");
            }
            return Ok(updated);
        }
    }
}
