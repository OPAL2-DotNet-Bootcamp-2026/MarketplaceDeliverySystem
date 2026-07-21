using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class DeleteOrderDTO
    {
        [Required]
        public int OrderId { get; set; }
    }
}
