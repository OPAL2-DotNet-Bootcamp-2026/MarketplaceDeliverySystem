using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class RegBusinessOwnerDTO
    {

        [Required]
        public int OwnerId { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage =
        "Password must contain at least 6 characters.")]
        public string PasswordHash { get; set; } = string.Empty;//User Input 
      

         public string Message { get; set; }
        }
    }

