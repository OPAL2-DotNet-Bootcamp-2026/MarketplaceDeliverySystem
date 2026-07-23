using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class BusinessProductRespDTO
    {
        public string ProductName { get; set; }

        public decimal Price { get; set; }
        public int StockQuantity { get; set; }

        public bool IsAvailable { get; set; }

        public double AverageRating { get; set; }
    }
}
