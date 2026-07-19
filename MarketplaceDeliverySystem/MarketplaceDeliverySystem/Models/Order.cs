using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.Models
{
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderId { get; set; }

        [ForeignKey(nameof(Customer))]
        [Required]
        public int CustomerId { get; set; }

        public Customer Customer { get; set; } = null!;

        [ForeignKey(nameof(Business))]
        [Required]
        public int BusinessId { get; set; }

        public Business Business { get; set; } = null!;

        [Required]
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        [Required]
        public decimal Subtotal { get; set; } = 0;

        public decimal DeliveryFee { get; set; } = (decimal)0.700;

        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        public string Status { get; set; } = string.Empty;
        public ICollection<OrderItem> OrderItems { get; set; }
    }
}
