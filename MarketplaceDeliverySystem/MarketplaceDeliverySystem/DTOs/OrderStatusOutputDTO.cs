namespace MarketplaceDeliverySystem.DTOs
{
    public class OrderStatusOutputDTO
    {
            public int OrderId { get; set; }

            public string OrderStatus { get; set; } = string.Empty;

            public string DeliveryStatus { get; set; } = string.Empty;
    }
}
