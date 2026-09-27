namespace MarketplaceDeliverySystem.DTOs
{
    public class PopularBusinessDTO
    {
        public int BusinessId { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public string? BusinessCategoryName { get; set; }
        public string? LogoUrl { get; set; }
        public string Address { get; set; } = string.Empty;
        public TimeOnly OpeningTime { get; set; }
        public TimeOnly ClosingTime { get; set; }
        public bool IsOpen { get; set; }
        public int OrderCount { get; set; }
    }
}
