using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.Models
{
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderId { get; set; }//System Generated 

        [ForeignKey(nameof(Customer))]
        [Required]
        public int CustomerId { get; set; }//From List (User selects a Customer)

        public Customer Customer { get; set; } = null!;//Navigation Property

        [ForeignKey(nameof(Business))]
        [Required]
        public int BusinessId { get; set; }//From List (User selects a Business)

        public Business Business { get; set; } = null!;// Navigation Property

        [Required]
        public DateTime OrderDate { get; set; } = DateTime.UtcNow; //System Generated

        [Required]
        [Precision(10, 3)]
        public decimal Subtotal { get; set; } = 0m;//Calculated

        [Precision(10, 3)]
        public decimal DeliveryFee { get; set; } =0.700m; //Default value

        [Required]

        [Precision(10, 3)]
        public decimal TotalAmount { get; set; }//Calculated (Subtotal + DeliveryFee)


        [Required(ErrorMessage = "Order status is required.")]

        public string Status { get; set; } = string.Empty; //System Generated (Default)
        public Payment Payment { get; set; } //navigation properety
        public Delivery Delivery { get; set; } //navigation properety
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>(); //navigation properities
    }
}
