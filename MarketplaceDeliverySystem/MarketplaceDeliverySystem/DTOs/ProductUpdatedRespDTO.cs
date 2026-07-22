using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class ProductUpdatedRespDTO
    {
        public int ProductId { get; set; }

        public string ProductName { get; set; }

        public string? Description { get; set; }

        public decimal Price { get; set; }

        public int StockQuantity { get; set; }
    }
}
