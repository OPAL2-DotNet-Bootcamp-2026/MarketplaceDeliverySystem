using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.Models
{
    [Index(nameof(Email), IsUnique = true)]
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }
        [Required, MaxLength(100)] 
        public string FullName { get; set; } = string.Empty;
        [Required,MaxLength(150)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required, MaxLength(256)] 
        public string PasswordHash { get; set; } = string.Empty;
        [Required, MaxLength(20)] 
        public string PhoneNumber { get; set; } = string.Empty;
        [MaxLength(300)] 
        public string? ProfileImage { get; set; }
        [Required, MaxLength(30)] 
        public string Role { get; set; } = "Customer";
        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;

        public Driver Driver { get; set; }   // Navigation Property
    }
}
