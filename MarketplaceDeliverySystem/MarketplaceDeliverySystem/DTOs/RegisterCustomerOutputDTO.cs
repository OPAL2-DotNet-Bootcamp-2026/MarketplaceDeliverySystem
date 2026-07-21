namespace MarketplaceDeliverySystem.DTOs
{
    public class RegisterCustomerOutputDTO
    {
        public int CustomerId { get; set; }

        public int UserId { get; set; }

        public string Role { get; set; } = string.Empty;

        public string Token { get; set; } = string.Empty;

        public DateTime ExpiresAtUtc { get; set; }
    }
}
