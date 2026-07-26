using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class RegisterCustomerDTO
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must contain at least 6 characters.")]
        public string Password { get; set; } = string.Empty;

        [Required]
        [MinLength(8, ErrorMessage = "Phone number must contain 8 characters without the country code.")]
        public string PhoneNumber { get; set; } = string.Empty;
        [MaxLength(300)]
        public string? ProfileImage { get; set; }

        [Required]
        [MaxLength(300)]
        public string Address { get; set; } = string.Empty;
    }

    public class UserResponseDTO
    {
        public int UserId { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Role { get; set; } = string.Empty;
    }
    public class LoginDTO
    {
        [Required]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]

        public string Password { get; set; }
    }
    public class LoginResponseDTO
    {
        public string Token { get; set; }

        public string Role { get; set; }

        public string FullName { get; set; }
    }

}