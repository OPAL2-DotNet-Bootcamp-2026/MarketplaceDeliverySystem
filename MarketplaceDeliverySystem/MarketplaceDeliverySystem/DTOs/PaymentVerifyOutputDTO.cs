namespace MarketplaceDeliverySystem.DTOs
{
    public class PaymentVerifyOutputDTO
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public int OrderId { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
    }
}
