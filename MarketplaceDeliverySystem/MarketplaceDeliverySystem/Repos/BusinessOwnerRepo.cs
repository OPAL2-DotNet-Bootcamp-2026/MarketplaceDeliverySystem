using MarketplaceDeliverySystem.Models;

namespace MarketplaceDeliverySystem.Repos
{
    public class BusinessOwnerRepo
    {
        private readonly MarketplaceContext _context;

        public BusinessOwnerRepo(MarketplaceContext context)
        {
            _context = context;
        }

        //The ? after BusinessOwner means the method can return null
        public BusinessOwner? GetById(int ownerId)
        {
            return _context.BusinessOwners
                           .FirstOrDefault(o => o.OwnerId == ownerId);
        }
    }
}
