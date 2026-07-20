using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.Models
{
    public class Category
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CategoryId { get; set; }//system generated

        [Required]
        [MaxLength(100)]
        public string CategoryName { get; set; } = string.Empty;//user input

        [MaxLength(500)]
        public string? Description { get; set; }//user input

        [MaxLength(300)]
        public string? ImageUrl { get; set; }//user input
        public ICollection<Product> Products { get; set; }//Navigation Property
    }
}
