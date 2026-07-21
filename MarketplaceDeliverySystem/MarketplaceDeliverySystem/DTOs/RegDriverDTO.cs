using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class RegDriverDTO
    {
        [Required]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage =
        "Password must contain at least 6 characters.")]
        public string Password { get; set; } = string.Empty;//User Input 

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
