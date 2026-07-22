using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class UpdateProductDTO
    {
        [Required]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "Product name is required.")]
        [MaxLength(150)]
        public string ProductName { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Stock quantity cannot be negative.")]
        public int StockQuantity { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }
}
