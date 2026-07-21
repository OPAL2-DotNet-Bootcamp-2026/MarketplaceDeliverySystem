using MarketplaceDeliverySystem.Models;

namespace MarketplaceDeliverySystem.Repos
{
    public class PaymentRepo
    {
        private readonly MarketplaceContext _context;

        public PaymentRepo(MarketplaceContext context)
        {
            _context = context;
        }

        public void AddPayment(Payment payment)
        {
            _context.Payments.Add(payment);
            _context.SaveChanges();
        }
    }
}
