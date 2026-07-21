using MarketplaceDeliverySystem.Models;
using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class FilterProductsDTO
    {
        public int? CategoryId { get; set; }

        public int? BusinessId { get; set; }

        [Required]
        [MaxLength(150)]
        public string ProductName { get; set; } = string.Empty;
    

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal? MinPrice { get; set; }


        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal? Price { get; set; }
       
        public bool? IsAvailable { get; set; }

        public bool SortByPrice { get; set; } = true;
    }
}
