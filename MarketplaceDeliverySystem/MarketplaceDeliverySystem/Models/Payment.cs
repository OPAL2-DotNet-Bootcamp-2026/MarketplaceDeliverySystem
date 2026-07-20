using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.Models
{
    public class Payment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PaymentId { get; set; }//System Generated 

        [ForeignKey(nameof(Order))]
        [Required]
        public int OrderId { get; set; }// From List (User selects an Order)

        public Order Order { get; set; } = null!; // Navigation Property

        [Required(ErrorMessage = "Payment method is required.")]
        public string PaymentMethod { get; set; } = string.Empty;//User Input

        [Required]
        public string PaymentStatus { get; set; } = string.Empty;//System Generated 

        [Required]
        public decimal Amount { get; set; } //Calculated

        [Required]
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow; //System Generated 
    }
}
