using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.Models
{
    public class Payment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PaymentId { get; set; }

        [ForeignKey(nameof(Order))]
        [Required]
        public int OrderId { get; set; }

        public Order Order { get; set; } = null!;

        [Required]
        public string PaymentMethod { get; set; } = string.Empty;

        [Required]
        public string PaymentStatus { get; set; } = string.Empty;

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    }
}
