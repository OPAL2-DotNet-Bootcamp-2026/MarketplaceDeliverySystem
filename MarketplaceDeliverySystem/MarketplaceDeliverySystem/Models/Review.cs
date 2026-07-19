using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.Models
{
    public class Review
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ReviewId { get; set; }

        [ForeignKey(nameof(Customer))]
        [Required]
        public int CustomerId { get; set; }

        public Customer Customer { get; set; } = null!;

        [ForeignKey(nameof(Product))]
        [Required]
        public int ProductId { get; set; }

        public Product Product { get; set; } = null!;

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(1000)]
        public string? Comment { get; set; }

        [Required]
        public DateTime ReviewDate { get; set; } = DateTime.UtcNow;
    }
}
