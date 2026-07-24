using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class AddProductInputDTO
    {
        [Required]
        public int BusinessId { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        [MaxLength(100)]
        public string ProductName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required]
        public int StockQuantity { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }
    }
}
