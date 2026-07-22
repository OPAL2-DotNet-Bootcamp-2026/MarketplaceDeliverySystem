using MarketplaceDeliverySystem.Models;
using Microsoft.EntityFrameworkCore;

namespace MarketplaceDeliverySystem.Repos
{
    public class CustomerRepo
    {
        private MarketplaceContext context;

        public CustomerRepo(MarketplaceContext _context)
        {
            context = _context;
        }

        public Customer? GetCustomerById(int customerId)
        {
            return context.Customers
                .FirstOrDefault(c => c.CustomerId == customerId);
        }

        public void AddCustomer(Customer customer)
        {
            context.Customers.Add(customer);
            context.SaveChanges();
        }

        public List<Order> GetCustomerOrders(int customerId)
        {
            return context.Orders

                .Where(o => o.CustomerId == customerId)

                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)

                .Include(o => o.Payment)

                .Include(o => o.Delivery)

                .OrderByDescending(o => o.OrderDate)

                .ToList();
        }


    }
}
