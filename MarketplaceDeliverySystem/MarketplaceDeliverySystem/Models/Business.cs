using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.Models
{
    public class Business
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BusinessId { get; set; }

        [Required]
        [ForeignKey(nameof(BusinessOwner))]
        public int OwnerId { get; set; }

        public BusinessOwner BusinessOwner { get; set; }

        [Required]
        [MaxLength(100)]
        public string BusinessName { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(300)]
        public string? LogoUrl { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required]
        [MaxLength(200)]
        public string Address { get; set; }

        [Required]
        public TimeSpan OpeningTime { get; set; }

        [Required]
        public TimeSpan ClosingTime { get; set; }

        public bool IsOpen { get; set; } = true;

        [Range(1,5)]
        public int? Rating { get; set; }

        public ICollection<Product> Products { get; set; } 
    }
}
