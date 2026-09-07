namespace MarketplaceDeliverySystem.DTOs
{
    public class OrderDetailsDTO
    {
        public int OrderId { get; set; }

        public string CustomerName { get; set; }

        public string BusinessName { get; set; }

        public DateTime OrderDate { get; set; }

        public string OrderStatus { get; set; }

        public decimal TotalAmount { get; set; }

        public string DeliveryAddress { get; set; }

        //The ? is important because an order can exist while no driver is assigned yet
        public string? DriverName { get; set; }

        public string? DriverPhone { get; set; }

        public List<OrderItemDTO> Products { get; set; }
    }
}
