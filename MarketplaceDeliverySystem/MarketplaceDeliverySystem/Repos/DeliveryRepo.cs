using MarketplaceDeliverySystem.Models;

namespace MarketplaceDeliverySystem.Repos
{
   public class DeliveryRepo
        {
            private readonly MarketplaceContext _context;

            public DeliveryRepo(MarketplaceContext context)
            {
                _context = context;
            }

            public Delivery? GetById(int deliveryId)
            {
                return _context.Deliveries
                    .FirstOrDefault(d => d.DeliveryId == deliveryId);
            }

            public void Update()
            {
                _context.SaveChanges();
            }
        }
    }
