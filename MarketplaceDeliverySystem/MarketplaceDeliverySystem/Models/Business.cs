using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.Models
{
    public class Business
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BusinessId { get; set; }//System Generated 

        [Required]
        [ForeignKey(nameof(BusinessOwner))]
        public int OwnerId { get; set; }// From List (Selected BusinessOwner)

        public BusinessOwner BusinessOwner { get; set; }//Navigation Property

        [Required(ErrorMessage = "Business name is required.")]
        [MaxLength(100)]
        public string BusinessName { get; set; }//User Input

        [MaxLength(500)]
        public string? Description { get; set; }//User Input

        [MaxLength(300)]
        public string? LogoUrl { get; set; }//User Input

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; }//user input

        [Required]
        [MaxLength(200)]
        public string Address { get; set; }//user input

        [Required]
        public TimeSpan OpeningTime { get; set; }//user input

        [Required]
        public TimeSpan ClosingTime { get; set; }//user input

        public bool IsOpen { get; set; } = true;//Default = true

        [Range(1,5)]
        public int? Rating { get; set; }//user input 
    }
}
