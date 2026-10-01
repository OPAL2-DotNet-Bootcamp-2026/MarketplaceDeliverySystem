using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class PaymentCheckoutDTO
    {
        [Range(1, int.MaxValue)]
        public int OrderId { get; set; }
    }
}
