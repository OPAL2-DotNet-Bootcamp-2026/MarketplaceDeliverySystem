using MarketplaceDeliverySystem.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.DTOs
{
    public class FilterProductsOutputDto
    {

        public int ProductId { get; set; }
  
        [Required]
        [MaxLength(150)]
        public string ProductName { get; set; } = string.Empty;
      

        [MaxLength(1000)]
        public string? Description { get; set; }


        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }


        [Required]
        [Range(0, int.MaxValue)]
        public int StockQuantity { get; set; }
      

        [MaxLength(300)]
        public string? ImageUrl { get; set; }
  
        [Required]
        public bool IsAvailable { get; set; } = true;


        [Required]
        [MaxLength(100)]
        public string BusinessName { get; set; }

        [Required]
        [MaxLength(100)]
        public string CategoryName { get; set; } = string.Empty;

        [Required]
        [Range(1, 5)]
        public double AverageRating { get; set; }//calculated 



    }
}
