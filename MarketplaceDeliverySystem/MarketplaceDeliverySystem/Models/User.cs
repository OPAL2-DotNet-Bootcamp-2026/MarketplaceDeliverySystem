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
        public int UserId { get; set; }//System Generated 
        [Required(ErrorMessage = "Full name is required."), MaxLength(100, ErrorMessage =
        "Full name cannot exceed 100 characters.")] 
        public string FullName { get; set; } = string.Empty;//User Input 
        [Required,MaxLength(150)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;//User Input 
        [Required, MaxLength(256)] 
        public string PasswordHash { get; set; } = string.Empty;//User Input 
        [Required, MaxLength(20)] 
        public string PhoneNumber { get; set; } = string.Empty;//User Input 
        [MaxLength(300)] 
        public string? ProfileImage { get; set; }//User Input 
        [Required, MaxLength(30)] 
        public string Role { get; set; } = "Customer";//user input:From Listsystem allows choosing Customer, BusinessOwner, or Driver
        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;// System Generated
        public bool IsActive { get; set; } = true;//(Default = true)

    }
}
