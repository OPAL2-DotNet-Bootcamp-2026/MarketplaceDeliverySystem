namespace MarketplaceDeliverySystem.DTOs
{
    public class FilterProductsOutputDto
    {
        public int ProductId { get; set; }

        public string ProductName { get; set; }

        public string? Description { get; set; }

        public decimal Price { get; set; }

        public int StockQuantity { get; set; }

        public bool IsAvailable { get; set; }

        public string? ImageUrl { get; set; }

        public string BusinessName { get; set; }

        public string CategoryName { get; set; }

        public double AverageRating { get; set; }
    }
}
