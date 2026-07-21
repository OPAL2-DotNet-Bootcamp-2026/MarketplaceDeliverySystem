using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class DeleteOrderOutputDTO
    {

        [Required]
        public string Message { get; set; }
    }
}
