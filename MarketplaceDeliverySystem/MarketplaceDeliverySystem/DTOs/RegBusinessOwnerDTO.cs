using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class RegBusinessOwnerDTO
    {
        [Required, MaxLength(100)]
        public string FullName { get; set; } = string.Empty;
        [Required, MaxLength(150)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
     

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage =
        "Password must contain at least 6 characters.")]
        public string Password { get; set; } = string.Empty;
        [Required, MaxLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;
        [MaxLength(300)]
        public string? ProfileImage { get; set; }
        [Required]
        [MaxLength(20)]
        public string NationalId { get; set; } 

        [MaxLength(50)]
        public string? BusinessLicense { get; set; } 

    }
    }

