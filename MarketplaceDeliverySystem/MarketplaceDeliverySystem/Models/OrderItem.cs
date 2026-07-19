using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.Models
{
    public class OrderItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderItemId { get; set; }

        [ForeignKey(nameof(Order))]
        [Required]
        public int OrderId { get; set; }

        public Order Order { get; set; } = null!;

        [ForeignKey(nameof(Product))]
        [Required]
        public int ProductId { get; set; }

        public Product Product { get; set; } = null!;

        [Required]
        [Range(1, 999)]
        public int Quantity { get; set; }

        [Required]
        public decimal UnitPrice { get; set; }
    }
}
