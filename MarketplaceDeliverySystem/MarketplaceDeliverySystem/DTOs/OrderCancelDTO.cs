using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class OrderCancelDTO
    {
        [Required]
        public int OrderId { get; set; }
    }
}
