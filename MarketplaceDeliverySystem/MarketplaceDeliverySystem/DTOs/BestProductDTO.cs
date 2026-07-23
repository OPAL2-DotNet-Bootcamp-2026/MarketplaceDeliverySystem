using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class BestProductDTO
    {

        [Required]
        [MaxLength(100)]
        public string BusinessName { get; set; }

        [Required]
        [MaxLength(150)]
        public string ProductName { get; set; } = string.Empty;

        [Required]
        [Range(1, 5)]
        public double AverageRating { get; set; }

        [Range(1, int.MaxValue)]
        public int NumberOfReviews { get; set; }
    }
}
