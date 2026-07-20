using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class AssignDriverToDeliveryDTO
    {
        [Required]
        public int DeliveryId { get; set; }

        [Required]
        public int DriverId { get; set; }
    }
}
