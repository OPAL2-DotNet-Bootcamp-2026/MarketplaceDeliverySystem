namespace MarketplaceDeliverySystem.DTOs
{
    public class BusinessDashboardOutputDTO
    {
        public int BusinessId { get; set; }

        public string BusinessName { get; set; } = string.Empty;

        public int TotalProducts { get; set; }

        public int TotalOrders { get; set; }

        public int PendingOrders { get; set; }

        public int PreparingOrders { get; set; }

        public int ReadyOrders { get; set; }

        public int DeliveredOrders { get; set; }

        public int CancelledOrders { get; set; }

        public decimal TotalRevenue { get; set; }

        public double AverageRating { get; set; }

        public int TotalReviews { get; set; }

        public int? BestRatedProductId { get; set; }

        public string? BestRatedProductName { get; set; }

        public double? BestRatedProductAverageRating { get; set; }

        public int LowOrZeroStockProducts { get; set; }

        public int LowStockThreshold { get; set; }
    }
}