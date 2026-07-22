using MarketplaceDeliverySystem.Models;

namespace MarketplaceDeliverySystem.Repos
{
    public class CategoryRepo
    {
        private readonly MarketplaceContext _context;

        public CategoryRepo(MarketplaceContext context)
        {
            _context = context;
        }

        public Category? GetById(int categoryId)
        {
            return _context.Categories
                           .FirstOrDefault(c => c.CategoryId == categoryId);
        }
    }
}
