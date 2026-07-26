namespace MarketplaceDeliverySystem.DTOs
{
    public class OrderItemDTO
    {
        public string ProductName { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal SubTotal { get; set; }
    }
}
