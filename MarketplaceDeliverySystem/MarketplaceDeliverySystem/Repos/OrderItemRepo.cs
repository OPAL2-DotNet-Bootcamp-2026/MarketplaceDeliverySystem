using MarketplaceDeliverySystem.Models;

namespace MarketplaceDeliverySystem.Repos
{
    public class OrderItemRepo
    {
        private readonly MarketplaceContext _context;

        public OrderItemRepo(MarketplaceContext context)
        {
            _context = context;
        }

        public void AddOrderItem(OrderItem orderItem)
        {
            _context.OrderItems.Add(orderItem);
            _context.SaveChanges();
        }
    }
}
