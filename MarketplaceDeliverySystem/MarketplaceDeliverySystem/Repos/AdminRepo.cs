using MarketplaceDeliverySystem.DTOs;

namespace MarketplaceDeliverySystem.Repos
{
    public class AdminRepo
    {
        private readonly MarketplaceContext _context;

        public AdminRepo(MarketplaceContext context)
        {
            _context = context;
        }

        public MarketplaceStatisticsOutputDTO
            GetMarketplaceStatistics()
        {
            decimal totalRevenue = _context.Payments
                .Where(p => p.PaymentStatus == "Paid")
                .Sum(p => (decimal?)p.Amount) ?? 0;

            decimal averageOrderValue = _context.Orders.Any()
                ? _context.Orders.Average(o => o.TotalAmount)
                : 0;

            List<HighestRatedBusinessDTO> highestRatedBusinesses =
                _context.Businesses
                    .Select(b => new HighestRatedBusinessDTO
                    {
                        BusinessId = b.BusinessId,

                        BusinessName = b.BusinessName,

                        AverageRating = _context.Reviews
                            .Where(r =>
                                r.Product.BusinessId == b.BusinessId)
                            .Select(r => (double?)r.Rating)
                            .Average() ?? 0
                    })
                    .OrderByDescending(b => b.AverageRating)
                    
                    .ToList();

            List<BestSellingProductDTO> bestSellingProducts =
                _context.OrderItems
                    .Where(oi => oi.Order.Status != "Cancelled")
                    .GroupBy(oi => new
                    {
                        oi.ProductId,
                        oi.Product.ProductName
                    })
                    .Select(group => new BestSellingProductDTO
                    {
                        ProductId = group.Key.ProductId,

                        ProductName = group.Key.ProductName,

                        TotalQuantitySold =
                            group.Sum(oi => oi.Quantity)
                    })
                    .OrderByDescending(p => p.TotalQuantitySold)
                   
                    .ToList();

            List<BusinessMostOrdersDTO> businessesWithMostOrders =
                _context.Businesses
                    .Select(b => new BusinessMostOrdersDTO
                    {
                        BusinessId = b.BusinessId,

                        BusinessName = b.BusinessName,

                        TotalOrders = _context.Orders
                            .Count(o =>
                                o.BusinessId == b.BusinessId)
                    })
                    .OrderByDescending(b => b.TotalOrders)
                    
                    .ToList();

            MarketplaceStatisticsOutputDTO statistics =
                new MarketplaceStatisticsOutputDTO
                {
                    TotalCustomers =
                        _context.Customers.Count(),

                    TotalBusinessOwners =
                        _context.BusinessOwners.Count(),

                    TotalDrivers =
                        _context.Drivers.Count(),

                    TotalBusinesses =
                        _context.Businesses.Count(),

                    TotalProducts =
                        _context.Products.Count(),

                    TotalOrders =
                        _context.Orders.Count(),

                    PendingOrders = _context.Orders
                        .Count(o => o.Status == "Pending"),

                    PreparingOrders = _context.Orders
                        .Count(o => o.Status == "Preparing"),

                    DeliveredOrders = _context.Orders
                        .Count(o => o.Status == "Delivered"),

                    CancelledOrders = _context.Orders
                        .Count(o => o.Status == "Cancelled"),

                    CompletedDeliveries = _context.Deliveries
                        .Count(d =>
                            d.DeliveryStatus == "Delivered"),

                    TotalRevenue = totalRevenue,

                    AverageOrderValue = averageOrderValue,

                    HighestRatedBusinesses =
                        highestRatedBusinesses,

                    BestSellingProducts =
                        bestSellingProducts,

                    BusinessesWithMostOrders =
                        businessesWithMostOrders
                };

            return statistics;
        }
    }
}
