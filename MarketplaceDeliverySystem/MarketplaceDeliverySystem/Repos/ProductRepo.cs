using MarketplaceDeliverySystem.Models;
using Microsoft.EntityFrameworkCore;

namespace MarketplaceDeliverySystem.Repos
{
    public class ProductRepo
    {
        private readonly MarketplaceContext _context;

        public ProductRepo(MarketplaceContext context)
        {
            _context = context;
        }

        public Product? GetProductById(int productId)
        {
            return _context.Products
                .FirstOrDefault(product =>
                    product.ProductId == productId);
        }

        public Business? GetBusinessById(int businessId)
        {
            return _context.Businesses
                .FirstOrDefault(business =>
                    business.BusinessId == businessId);
        }

        public Category? GetCategoryById(int categoryId)
        {
            return _context.Categories
                .FirstOrDefault(category =>
                    category.CategoryId == categoryId);
        }

        public async Task<Business?> GetBusinessByIdAsync(
            int businessId)
        {
            return await _context.Businesses
                .FirstOrDefaultAsync(business =>
                    business.BusinessId == businessId);
        }

        public async Task<Category?> GetCategoryByIdAsync(
            int categoryId)
        {
            return await _context.Categories
                .FirstOrDefaultAsync(category =>
                    category.CategoryId == categoryId);
        }

        public async Task AddProductAsync(Product product)
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
        }

        public void UpdateProduct(Product product)
        {
            _context.Products.Update(product);
            _context.SaveChanges();
        }
    }
}