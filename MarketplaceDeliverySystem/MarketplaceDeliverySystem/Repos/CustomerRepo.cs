using MarketplaceDeliverySystem.Models;

namespace MarketplaceDeliverySystem.Repos
{
    public class CustomerRepo
    {
        private readonly MarketplaceContext _context;

        public CustomerRepo(MarketplaceContext context)
        {
            _context = context;
        }

        public Customer? GetCustomerById(int customerId)
        {
            return _context.Customers
                .FirstOrDefault(customer =>
                    customer.CustomerId == customerId);
        }
        public void Add(Customer customer)
        {
            _context.Customers.Add(customer);
            _context.SaveChanges();
        }

    }
}
