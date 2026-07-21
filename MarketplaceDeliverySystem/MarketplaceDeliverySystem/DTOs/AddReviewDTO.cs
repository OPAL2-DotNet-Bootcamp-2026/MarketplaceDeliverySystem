using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class AddReviewDTO
    {
            [Required]
            public int CustomerId { get; set; }

            [Required]
            public int ProductId { get; set; }

            [Required]
            [Range(1, 5)]
            public int Rating { get; set; }

            [MaxLength(1000)]
            public string? Comment { get; set; }
        }
}
