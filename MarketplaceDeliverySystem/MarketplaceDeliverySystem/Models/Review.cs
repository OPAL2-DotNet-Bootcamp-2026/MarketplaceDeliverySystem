using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.Models
{
    public class Review
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ReviewId { get; set; }      // System Generated (Identity Primary Key)

        [ForeignKey(nameof(Customer))]
        [Required]
        public int CustomerId { get; set; }    // From List (User selects a Customer)

        public Customer Customer { get; set; } = null!;   // Navigation Property

        [ForeignKey(nameof(Product))]
        [Required]
        public int ProductId { get; set; }     // From List (User selects a Product)

        public Product Product { get; set; } = null!;     // Navigation Property

        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int Rating { get; set; }        // User Input

        [MaxLength(1000)]
        public string? Comment { get; set; }   // User Input (Optional)

        [Required]
        public DateTime ReviewDate { get; set; } = DateTime.UtcNow;
        // System Generated (Set to DateTime.Now / UtcNow when review is created)
    }
}
