namespace MarketplaceDeliverySystem.DTOs
{
    public class BusinessCardRespDTO
    {
        public int BusinessId { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public int? BusinessCategoryId { get; set; }
        public string? BusinessCategoryName { get; set; }
        public string? LogoUrl { get; set; }
        public TimeOnly OpeningTime { get; set; }
        public TimeOnly ClosingTime { get; set; }
        public bool IsOpen { get; set; }
    }
}
