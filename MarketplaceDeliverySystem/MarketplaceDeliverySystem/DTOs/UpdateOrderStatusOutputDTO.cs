namespace MarketplaceDeliverySystem.DTOs
{
    public class UpdateOrderStatusOutputDTO
    {
        public int OrderId { get; set; }

        public string OrderStatus { get; set; } = string.Empty;

        public int DeliveryId { get; set; }

        public string DeliveryStatus { get; set; } = string.Empty;
    }
}