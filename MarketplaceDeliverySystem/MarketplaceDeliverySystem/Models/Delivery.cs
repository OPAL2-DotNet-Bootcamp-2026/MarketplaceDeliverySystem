using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.Models
{
    public class Delivery
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DeliveryId { get; set; }

        [ForeignKey(nameof(Order))]
        [Required]
        public int OrderId { get; set; }

        public Order Order { get; set; } = null!;

        [ForeignKey(nameof(Driver))]
        [Required]
        public int DriverId { get; set; }

        public Driver Driver { get; set; } = null!;

        [Required]
        public string DeliveryStatus { get; set; } = string.Empty;

        [Required]
        public DateTime PickupTime { get; set; }

        [Required]
        public DateTime DeliveredTime { get; set; }

        public decimal DeliveryDuration { get; set; }
    }
}
