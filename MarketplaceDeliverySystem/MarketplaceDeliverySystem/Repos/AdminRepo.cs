using MarketplaceDeliverySystem.Data;
using MarketplaceDeliverySystem.Models;
using Microsoft.EntityFrameworkCore;

namespace MarketplaceDeliverySystem.Repos
{
    public class AdminRepo
    {
        private readonly MarketplaceContext _context;

        public AdminRepo(MarketplaceContext context)
        {
            _context = context;
        }

        public List<Business> GetAllForDashboard()
        {
            return _context.Businesses
                .Include(
                    business => business.Products)
                .ThenInclude(
                    product => product.Reviews)
                .Include(
                    business => business.Orders)
                .ThenInclude(
                    order => order.Payment)
                .ToList();
        }
    }
}