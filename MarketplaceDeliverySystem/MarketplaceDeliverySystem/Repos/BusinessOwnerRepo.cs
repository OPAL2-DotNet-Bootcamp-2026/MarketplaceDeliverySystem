using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;

namespace MarketplaceDeliverySystem.Repos
{
    public class BusinessOwnerRepo
    {


        private readonly MarketplaceContext context;

        public BusinessOwnerRepo(MarketplaceContext _context)
        {
            context = _context;
        }

        public bool EmailExists(string email)
        {
            return context.Users.Any(u => u.Email == email);
        }
        public bool NationalIdExists(string nationalId)
        {
            return context.BusinessOwners.Any(b => b.NationalId == nationalId);
        }
        public void Add(BusinessOwner owner)
        {
            context.BusinessOwners.Add(owner);
            context.SaveChanges();
        }

    }
}
