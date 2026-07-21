using MarketplaceDeliverySystem.Models;
using static MarketplaceDeliverySystem.Repos.UserRepo;

namespace MarketplaceDeliverySystem.Repos
{
    public class UserRepo
    {
            private readonly MarketplaceContext _context;

            public UserRepo(MarketplaceContext context)
            {
                _context = context;
            }

            public bool EmailExists(string email)
            {
                return _context.Users.Any(u => u.Email == email);
            }

            public void Add(User user)
            {
                _context.Users.Add(user);
                _context.SaveChanges();
            }
        
    }
}
