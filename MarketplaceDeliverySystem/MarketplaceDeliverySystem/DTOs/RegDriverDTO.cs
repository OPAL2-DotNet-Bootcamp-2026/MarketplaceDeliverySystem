using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class RegDriverDTO
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(30)]
        public string LicenseNumber { get; set; } = string.Empty;

        [Required]
        [MaxLength(30)]
        public string VehicleType { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string VehiclePlateNumber { get; set; } = string.Empty;
    }
}
