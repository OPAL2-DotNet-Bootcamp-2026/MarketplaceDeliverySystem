namespace MarketplaceDeliverySystem.DTOs
{
    public class FilterProductsDTO
    {
        public int? CategoryId { get; set; }

        public int? BusinessId { get; set; }

        public decimal? MinPrice { get; set; }

        public decimal? MaxPrice { get; set; }

        public bool? IsAvailable { get; set; }

        public string? ProductName { get; set; }

        public string? SortByPrice { get; set; }
    }
}
