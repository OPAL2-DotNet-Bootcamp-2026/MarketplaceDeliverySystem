using MarketplaceDeliverySystem.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.DTOs
{
    public class BusinessRegInputDTO
    {
        [Required] 
        public int OwnerId { get; set; }

        [Required(ErrorMessage = "Business name is required.")]
        [MaxLength(100)]
        public string BusinessName { get; set; }//User Input

        [MaxLength(500)]
        public string? Description { get; set; }//User Input

        [MaxLength(300)]
        public string? LogoUrl { get; set; }//User Input

        [Required(ErrorMessage = "Business email is required.")]
        [EmailAddress(ErrorMessage = "Please enter a valid business email address.")]
        [MaxLength(100)]
        public string Email { get; set; }//user input

        [Required(ErrorMessage = "Business address is required.")]
        [MaxLength(200)]
        public string Address { get; set; }//user input

        [Required]
        public TimeOnly OpeningTime { get; set; }//user input

        [Required]
        public TimeOnly ClosingTime { get; set; }//user input

    }
}
