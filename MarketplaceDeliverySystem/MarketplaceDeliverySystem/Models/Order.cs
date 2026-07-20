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
        public decimal Subtotal { get; set; } = 0;//Calculated

        public decimal DeliveryFee { get; set; } = (decimal)0.700; //Default value

        [Required]
        public decimal TotalAmount { get; set; }//Calculated (Subtotal + DeliveryFee)


        [Required]
        public string Status { get; set; } = string.Empty; //System Generated (Default)
    }
}
