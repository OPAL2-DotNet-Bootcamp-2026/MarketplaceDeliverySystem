using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class CancelOrderDTO
    {
        [Required]
        public int OrderId { get; set; }
    }
}
