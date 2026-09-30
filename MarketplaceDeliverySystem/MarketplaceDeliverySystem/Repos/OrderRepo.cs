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

        public Order? GetOrderWithDetails(int orderId, int userId)
        {
            return _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderItems)
                .FirstOrDefault(o => o.OrderId == orderId && o.Customer.UserId == userId);
        }

        public void Update()
        {
            _context.SaveChanges();
        }

        // Order with items and payment, only if it belongs to the given user.
        public Order? GetForPayment(int orderId, int userId)
        {
            return _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Payment)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .FirstOrDefault(o => o.OrderId == orderId && o.Customer.UserId == userId);
        }

        public Order? GetById(int orderId, int userId)
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

                .FirstOrDefault(o => o.OrderId == orderId && o.Customer.UserId == userId);
        }
        // Only return active orders belonging to the logged-in customer
        public List<Order> GetActiveOrdersByUserId(int userId)
        {
            return _context.Orders
                .Include(o => o.Customer)
                    .ThenInclude(c => c.User)

                .Include(o => o.Business)

                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)

                .Include(o => o.Delivery)
                    .ThenInclude(d => d.Driver)
                        .ThenInclude(d => d.User)

                .Where(o =>
                       o.Customer.UserId == userId &&
                       (
                        o.Status == "Pending" ||
                        o.Status == "Ready" ||
                        o.Status == "On the Way" ||
                       (
                        o.Status == "Delivered" &&
                        o.Delivery != null &&
                        o.Delivery.DeliveredTime >= DateTime.UtcNow.AddHours(-24)
                        )
                        ))

                .OrderByDescending(o => o.OrderDate)
                .ToList();
        }

        //It gets all orders belonging to the logged-in customer
        public List<Order> GetOrderHistoryByUserId(int userId)
        {
            return _context.Orders
                .Include(o => o.Customer)
                    .ThenInclude(c => c.User)
                .Include(o => o.Business)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.Payment)
                .Include(o => o.Delivery)
                .Where(o => o.Customer.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToList();
        }

    }
}
