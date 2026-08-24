namespace MarketplaceDeliverySystem.DTOs
{
    public class BusinessCardRespDTO
    {
        public int BusinessId { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public TimeOnly OpeningTime { get; set; }
        public TimeOnly ClosingTime { get; set; }
        public bool IsOpen { get; set; }
    }
}
