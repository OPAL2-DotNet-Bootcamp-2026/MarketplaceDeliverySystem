using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Services;
using MarketplaceDeliverySystem.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MarketplaceDeliverySystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _productService;
        private readonly MarketplaceContext _context;

        public ProductController(ProductService productService, MarketplaceContext context)
        {
            _productService = productService;
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,BusinessOwner")]
        public async Task<IActionResult> CreateProduct(CreateProductDTO dto)
        {
            if (!await CanManageBusiness(dto.BusinessId)) return NotFound("Business not found.");
            if (!await _context.Categories.AnyAsync(c => c.CategoryId == dto.CategoryId))
                return BadRequest("Category not found.");

            var product = new Product
            {
                BusinessId = dto.BusinessId,
                CategoryId = dto.CategoryId,
                ProductName = dto.ProductName,
                Description = dto.Description,
                Price = dto.Price,
                StockQuantity = dto.StockQuantity,
                ImageUrl = dto.ImageUrl
            };
            if (dto.ProductNameAr != null) ProductTranslationPolicy.SetName(product, dto.ProductNameAr);
            if (dto.DescriptionAr != null) ProductTranslationPolicy.SetDescription(product, dto.DescriptionAr);
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return StatusCode(StatusCodes.Status201Created, new { product.ProductId });
        }

        [HttpPut("update/{id}")]
        [Authorize(Roles = "Admin,BusinessOwner")]
        public async Task<IActionResult> UpdateProduct(int id, UpdateProductDTO dto)
        {
            int? businessId = await _context.Products.Where(p => p.ProductId == id)
                .Select(p => (int?)p.BusinessId).FirstOrDefaultAsync();
            if (businessId == null || !await CanManageBusiness(businessId.Value))
                return NotFound("Product not found.");
            ProductUpdatedRespDTO updated = _productService.UpdateProduct(id, dto);
            if (updated == null)
            {
                return NotFound("Product not found.");
            }
            return Ok(updated);
        }

        private async Task<bool> CanManageBusiness(int businessId)
        {
            if (User.IsInRole("Admin"))
                return await _context.Businesses.AnyAsync(b => b.BusinessId == businessId);
            if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId)) return false;
            return await _context.Businesses.AnyAsync(b =>
                b.BusinessId == businessId && b.BusinessOwner.UserId == userId);
        }

        [HttpPost("FilterProducts")]
        [Authorize(Roles = "Customer")]
        public IActionResult FilterProducts(FilterProductsDTO dto)
        {
            List<FilterProductsOutputDto> result = _productService.FilterProducts(dto);

            return Ok(result);
        }

        [HttpDelete("DeleteProduct")]
        public IActionResult DeleteProduct(int productId)
        {
            string result = _productService.DeleteProduct(productId);

            if (result == "Product not found")
            {
                return NotFound(result);
            }

            return Ok(result);
        }

        [HttpGet("business/{businessId:int}")]
        [Authorize(Roles = "Customer")]
        public IActionResult GetProductsByBusiness(int businessId, [FromQuery] int? categoryId = null)
        {
            List<FilterProductsOutputDto> result = _productService.GetProductsByBusiness(businessId, categoryId);
            return Ok(result);
        }

        [HttpGet("GetBusinessHeader/{businessId}")]
        [Authorize(Roles = "Customer")]
        public IActionResult GetBusinessHeader(int businessId)
        {
            var header = _productService.GetBusinessHeader(businessId);
            if (header == null) return NotFound("Business not found");
            return Ok(header);
        }

    }
}
