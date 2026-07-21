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

        public List<Product> GetAllProducts()
        {
            return _context.Products
                .Include(p => p.Business)
                .Include(p => p.Category)
                .Include(p => p.Reviews)
                .ToList();
        }

        public Product? GetById(int productId)
        {
            return _context.Products
                .FirstOrDefault(p => p.ProductId == productId);
        }

        public void Update()
        {
            _context.SaveChanges();
        }
    }
}
