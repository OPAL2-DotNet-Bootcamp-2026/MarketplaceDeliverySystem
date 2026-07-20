using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.Models
{
    public class OrderItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderItemId { get; set; }//System Generated

        [ForeignKey(nameof(Order))]
        [Required]
        public int OrderId { get; set; }//From List (Selected Order)

        public Order Order { get; set; } = null!;//Navigation Property

        [ForeignKey(nameof(Product))]
        [Required]
        public int ProductId { get; set; }// From List (Selected Product)

        public Product Product { get; set; } = null!;//Navigation Property


        [Required]
        [Range(1, 999)]
        public int Quantity { get; set; }// User Input

        [Required]
        public decimal UnitPrice { get; set; }//System Generated (Copied from Product.Price at the time of the order)
    }
}
