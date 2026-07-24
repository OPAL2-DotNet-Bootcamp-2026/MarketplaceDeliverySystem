namespace MarketplaceDeliverySystem.DTOs
{
    public class AddProductOutputDTO
    {
        public int ProductId { get; set; }

        public int BusinessId { get; set; }

        public int CategoryId { get; set; }

        public string ProductName { get; set; } = string.Empty;

        public bool IsAvailable { get; set; }

        public DateTime CreatedAtUtc { get; set; }
    }
}
