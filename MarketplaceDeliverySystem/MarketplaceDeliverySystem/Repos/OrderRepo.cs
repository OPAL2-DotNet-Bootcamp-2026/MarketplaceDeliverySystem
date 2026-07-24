using MarketplaceDeliverySystem.Models;
using Microsoft.EntityFrameworkCore;

namespace MarketplaceDeliverySystem.Repos
{
    public class OrderRepo
    {
        private readonly MarketplaceContext _context;

        public OrderRepo(MarketplaceContext context)
        {
            _context = context;
        }

        public Order? GetOrderWithDelivery(int orderId)
        {
            return _context.Orders
                .Include(order => order.Delivery)
                .FirstOrDefault(
                    order => order.OrderId == orderId);
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
}