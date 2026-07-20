using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.Models
{
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProductId { get; set; }
        //System Generated (Identity Primary Key)

        [ForeignKey(nameof(Business))]
        [Required]
        public int BusinessId { get; set; }
        //From List (User selects a Business)

        public Business Business { get; set; } = null!;
        //Navigation Property

        [ForeignKey(nameof(Category))]
        [Required]
        public int CategoryId { get; set; }
        //From List (User selects a Category)

        public Category Category { get; set; } = null!;
        //Navigation Property

        [Required]
        [MaxLength(150)]
        public string ProductName { get; set; } = string.Empty;
        //User Input

        [MaxLength(1000)]
        public string? Description { get; set; }
        //User Input (Optional)

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }
        //User Input

        [Required]
        [Range(0, int.MaxValue)]
        public int StockQuantity { get; set; }
        //User Input

        [MaxLength(300)]
        public string? ImageUrl { get; set; }
        //User Input 

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        //System Generated (DateTime.Now)

        public bool IsAvailable { get; set; } = true;
        // (Default = true)
        //product.IsAvailable = product.StockQuantity > 0; other way??
    }
}
