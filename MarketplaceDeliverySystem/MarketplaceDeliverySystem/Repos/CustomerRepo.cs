using MarketplaceDeliverySystem.Models;

namespace MarketplaceDeliverySystem.Repos
{
    public class CustomerRepo
    {
        private MarketplaceContext context;

        public CustomerRepo(MarketplaceContext _context)
        {
            context = _context;
        }

        public Customer GetCustomerById(int customerId)
        {
            return context.Customers
                .FirstOrDefault(c => c.CustomerId == customerId);
        }

        public void AddCustomer(Customer customer)
        {
            context.Customers.Add(customer);
            context.SaveChanges();
        }
    }
}
