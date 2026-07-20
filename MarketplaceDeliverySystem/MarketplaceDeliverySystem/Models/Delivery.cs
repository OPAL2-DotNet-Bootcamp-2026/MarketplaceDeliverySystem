using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.Models
{
    public class Delivery
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DeliveryId { get; set; }
        //System Generated (Identity Primary Key)

        [ForeignKey(nameof(Order))]
        [Required]
        public int OrderId { get; set; }
        //From List (Selected Order)

        public Order Order { get; set; } = null!;
        //Navigation Property

        [ForeignKey(nameof(Driver))]
        [Required]
        public int DriverId { get; set; }
        //From List (Selected Driver)

        public Driver Driver { get; set; } = null!;
        //Navigation Property

        [Required]
        public string DeliveryStatus { get; set; } = string.Empty;
        //(Default = "Pending" or "Assigned")

        [Required]
        public DateTime PickupTime { get; set; }
        //System Generated (Recorded when the driver picks up the order)

        [Required]
        public DateTime DeliveredTime { get; set; }
        //System Generated (Recorded when the order is delivered)

        public decimal DeliveryDuration { get; set; }
        //Calculated (DeliveredTime - PickupTime)
    }
}