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

        public void AddOrder(Order order)
        {
            _context.Orders.Add(order);
            _context.SaveChanges();
        }

        public Order? GetOrderWithDetails(int orderId)
        {
            return _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefault(o => o.OrderId == orderId);
        }

        public void Update()
        {
            _context.SaveChanges();
        }

        public Order? GetById(int orderId)
        {
            return _context.Orders
                .Include(o => o.Customer)
                    .ThenInclude(c => c.User)

                .Include(o => o.Business)

                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)

                // Get Delivery
                .Include(o => o.Delivery)
                    // Get Driver
                    .ThenInclude(d => d.Driver)
                        // Get driver's User
                        .ThenInclude(d => d.User)

                .FirstOrDefault(o => o.OrderId == orderId);
        }
    }
}
