using System.ComponentModel.DataAnnotations;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MarketplaceDeliverySystem.Controllers
{
    // Arabic catalog copy is managed separately from the existing English fields.
    [ApiController]
    [Route("api/catalog-translations")]
    public class CatalogTranslationsController : ControllerBase
    {
        private readonly MarketplaceContext _context;
        private readonly IConfiguration _configuration;

        public CatalogTranslationsController(MarketplaceContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public sealed class ProductTranslation
        {
            [MaxLength(150)] public string? NameAr { get; set; }
            [MaxLength(1000)] public string? DescriptionAr { get; set; }
        }

        public sealed class BusinessTranslation
        {
            [MaxLength(100)] public string? NameAr { get; set; }
            [MaxLength(500)] public string? DescriptionAr { get; set; }
        }

        public sealed class CategoryTranslation
        {
            [MaxLength(100)] public string? NameAr { get; set; }
            [MaxLength(500)] public string? DescriptionAr { get; set; }
        }

        public sealed class BusinessCategoryTranslation
        {
            [MaxLength(100)] public string? NameAr { get; set; }
        }

        [HttpPut("products/{id:int}")]
        [Authorize(Roles = "Admin,BusinessOwner")]
        public async Task<IActionResult> UpdateProduct(int id, ProductTranslation translation)
        {
            Product? product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            if (!await CanManageProduct(product)) return NotFound();
            ProductTranslationPolicy.SetManual(product, translation.NameAr, translation.DescriptionAr);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("products/{id:int}")]
        [Authorize(Roles = "Admin,BusinessOwner")]
        public async Task<IActionResult> GetProduct(int id)
        {
            Product? product = await _context.Products.AsNoTracking().FirstOrDefaultAsync(p => p.ProductId == id);
            if (product == null || !await CanManageProduct(product)) return NotFound();
            return Ok(new
            {
                product.ProductId,
                product.ProductName,
                product.Description,
                product.ProductNameAr,
                product.DescriptionAr,
                product.ProductNameArIsManual,
                product.DescriptionArIsManual,
                product.ProductNameArNeedsReview,
                product.DescriptionArNeedsReview,
                AutoTranslationConfigured =
                    !string.IsNullOrWhiteSpace(_configuration["Translation:ApiKey"]),
                TranslationPending =
                    (!product.ProductNameArIsManual && product.ProductNameAr == null) ||
                    (!string.IsNullOrWhiteSpace(product.Description) &&
                     !product.DescriptionArIsManual && product.DescriptionAr == null),
                product.TranslationAttempts,
                product.NextTranslationAttemptAtUtc
            });
        }

        private async Task<bool> CanManageProduct(Product product)
        {
            if (User.IsInRole("Admin")) return true;
            if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId)) return false;
            return await _context.Businesses.AnyAsync(b =>
                b.BusinessId == product.BusinessId && b.BusinessOwner.UserId == userId);
        }

        [HttpPut("businesses/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateBusiness(int id, BusinessTranslation translation)
        {
            Business? business = await _context.Businesses.FindAsync(id);
            if (business == null) return NotFound();
            business.BusinessNameAr = string.IsNullOrWhiteSpace(translation.NameAr) ? null : translation.NameAr.Trim();
            business.DescriptionAr = string.IsNullOrWhiteSpace(translation.DescriptionAr) ? null : translation.DescriptionAr.Trim();
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("categories/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCategory(int id, CategoryTranslation translation)
        {
            Category? category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();
            category.CategoryNameAr = string.IsNullOrWhiteSpace(translation.NameAr) ? null : translation.NameAr.Trim();
            category.DescriptionAr = string.IsNullOrWhiteSpace(translation.DescriptionAr) ? null : translation.DescriptionAr.Trim();
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("business-categories/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateBusinessCategory(int id, BusinessCategoryTranslation translation)
        {
            BusinessCategory? category = await _context.BusinessCategories.FindAsync(id);
            if (category == null) return NotFound();
            category.BusinessCategoryNameAr = string.IsNullOrWhiteSpace(translation.NameAr) ? null : translation.NameAr.Trim();
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
