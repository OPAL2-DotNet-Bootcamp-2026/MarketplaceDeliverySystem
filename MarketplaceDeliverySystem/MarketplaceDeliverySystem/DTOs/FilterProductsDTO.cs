using MarketplaceDeliverySystem.Models;
using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class FilterProductsDTO
    {
        public int? CategoryId { get; set; }

        public int? BusinessId { get; set; }

        [MaxLength(150)]
        public string ProductName { get; set; } = string.Empty;
    

        [Range(0.01, double.MaxValue)]
        public decimal? MinPrice { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal? MaxPrice { get; set; }
       
        public bool? IsAvailable { get; set; }

        public string? SortByPrice { get; set; } 
    }
}
