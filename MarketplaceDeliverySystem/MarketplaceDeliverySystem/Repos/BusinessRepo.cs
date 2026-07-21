using MarketplaceDeliverySystem.Models;
using Microsoft.EntityFrameworkCore;

namespace MarketplaceDeliverySystem.Repos
{
    public class BusinessRepo
    {
        private readonly MarketplaceContext _context;

        public BusinessRepo(MarketplaceContext context)
        {
            _context = context;
        }

        public void Add(Business business)
        {
            _context.Businesses.Add(business);
            _context.SaveChanges();
        }

        public bool EmailExists(string email)
        {
            return _context.Businesses
                .Any(b => b.Email == email);
        }

        public Business? GetBusinessById(int businessId)
        {
            return _context.Businesses
                .FirstOrDefault(b => b.BusinessId == businessId);
        }
    }
}
