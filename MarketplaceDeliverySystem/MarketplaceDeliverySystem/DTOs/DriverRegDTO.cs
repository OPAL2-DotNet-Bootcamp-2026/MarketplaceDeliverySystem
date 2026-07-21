using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class DriverRegDTO
    {
     
        [Required, MinLength(3)]
        public string FullName { get; set; } = string.Empty;//User Input
        [Required, MinLength(8)]
        public string PhoneNumber { get; set; } = string.Empty;//User Input 
        [Required(ErrorMessage = "Email is required."), MinLength(7, ErrorMessage =
        "Email cannot exceed les than 7 characters.")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage =
        "Password must contain at least 6 characters.")]
        public string Password { get; set; } = string.Empty;//User Input 

        [MaxLength(300)]
        public string? ProfileImage { get; set; }//User Input 

        [Required]
        [MinLength(4)]
        public string LicenseNumber { get; set; } = string.Empty;

        [Required]
        [MinLength(3)]
        public string VehicleType { get; set; } = string.Empty;

        [Required]
        [MinLength(1)]
        public string VehiclePlateNumber { get; set; } = string.Empty;
    }
}
