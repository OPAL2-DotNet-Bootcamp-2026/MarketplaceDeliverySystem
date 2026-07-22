namespace MarketplaceDeliverySystem.DTOs
{
    public class OrderHistoryDTO
    {
        public int OrderId { get; set; }

        public DateTime OrderDate { get; set; }

        public string OrderStatus { get; set; }

        public decimal TotalAmount { get; set; }

        public string PaymentStatus { get; set; }

        public string DeliveryStatus { get; set; }

        public List<OrderItemHistoryDTO> Products { get; set; }
    }
}
