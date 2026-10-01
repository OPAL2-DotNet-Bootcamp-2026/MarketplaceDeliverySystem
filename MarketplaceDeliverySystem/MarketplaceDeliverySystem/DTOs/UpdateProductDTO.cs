using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class UpdateProductDTO
    {

        [Required(ErrorMessage = "Product name is required.")]
        [MaxLength(150)]
        public string ProductName { get; set; }
        [MaxLength(150)]
        public string? ProductNameAr { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }
        [MaxLength(1000)]
        public string? DescriptionAr { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Stock quantity cannot be negative.")]
        public int StockQuantity { get; set; }

    }
}
