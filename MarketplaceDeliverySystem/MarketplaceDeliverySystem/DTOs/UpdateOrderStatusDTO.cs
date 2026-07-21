using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class UpdateOrderStatusDTO
    {
            [Required]
            public string Status { get; set; } = string.Empty;
    }
}
