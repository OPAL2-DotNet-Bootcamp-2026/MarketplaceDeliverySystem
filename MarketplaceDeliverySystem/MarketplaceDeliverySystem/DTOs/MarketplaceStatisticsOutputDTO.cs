namespace MarketplaceDeliverySystem.DTOs
{
    public class MarketplaceStatisticsOutputDTO
    {
        public int TotalCustomers { get; set; }

        public int TotalBusinessOwners { get; set; }

        public int TotalDrivers { get; set; }

        public int TotalBusinesses { get; set; }

        public int TotalProducts { get; set; }

        public int TotalOrders { get; set; }

        public int PendingOrders { get; set; }

        public int PreparingOrders { get; set; }

        public int DeliveredOrders { get; set; }

        public int CancelledOrders { get; set; }

        public int CompletedDeliveries { get; set; }

        public decimal TotalRevenue { get; set; }

        public decimal AverageOrderValue { get; set; }

        public List<HighestRatedBusinessDTO>
            HighestRatedBusinesses
        { get; set; } = new();

        public List<BestSellingProductDTO>
            BestSellingProducts
        { get; set; } = new();

        public List<BusinessMostOrdersDTO>
            BusinessesWithMostOrders
        { get; set; } = new();
    }

    public class HighestRatedBusinessDTO
    {
        public int BusinessId { get; set; }

        public string BusinessName { get; set; } = string.Empty;

        public double AverageRating { get; set; }
    }

    public class BestSellingProductDTO
    {
        public int ProductId { get; set; }

        public string ProductName { get; set; } = string.Empty;

        public int TotalQuantitySold { get; set; }
    }

    public class BusinessMostOrdersDTO
    {
        public int BusinessId { get; set; }

        public string BusinessName { get; set; } = string.Empty;

        public int TotalOrders { get; set; }
    }
}


