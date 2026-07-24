using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Repos;

namespace MarketplaceDeliverySystem.Services
{
    public class AdminService
    {
        private readonly AdminRepo _adminRepo;

        public AdminService(AdminRepo adminRepo)
        {
            _adminRepo = adminRepo;
        }

        public List<BusinessDashboardOutputDTO>
            GetBusinessDashboard()
        {
            List<Business> businesses =
                _adminRepo.GetAllForDashboard();

            List<BusinessDashboardOutputDTO> result =
                new List<BusinessDashboardOutputDTO>();

            foreach (Business business in businesses)
            {
                List<Review> reviews =
                    business.Products
                        .SelectMany(
                            product => product.Reviews)
                        .ToList();

                Product? bestProduct =
                    business.Products
                        .Where(
                            product =>
                                product.Reviews.Any())
                        .OrderByDescending(
                            product =>
                                product.Reviews.Average(
                                    review =>
                                        review.Rating))
                        .FirstOrDefault();

                decimal totalRevenue =
                    business.Orders
                        .Where(
                            order =>
                                order.Payment != null
                                &&
                                order.Payment.PaymentStatus
                                    == "Paid")
                        .Sum(
                            order =>
                                order.Payment!.Amount);

                BusinessDashboardOutputDTO dashboard =
                    new BusinessDashboardOutputDTO
                    {
                        BusinessId =
                            business.BusinessId,

                        BusinessName =
                            business.BusinessName,

                        TotalProducts =
                            business.Products.Count,

                        TotalOrders =
                            business.Orders.Count,

                        PendingOrders =
                            business.Orders.Count(
                                order =>
                                    order.Status
                                        == "Pending"),

                        PreparingOrders =
                            business.Orders.Count(
                                order =>
                                    order.Status
                                        == "Preparing"),

                        ReadyOrders =
                            business.Orders.Count(
                                order =>
                                    order.Status
                                        == "Ready"),

                        DeliveredOrders =
                            business.Orders.Count(
                                order =>
                                    order.Status
                                        == "Delivered"),

                        CancelledOrders =
                            business.Orders.Count(
                                order =>
                                    order.Status
                                        == "Cancelled"),

                        TotalRevenue =
                            totalRevenue,

                        AverageRating =
                            reviews.Any()
                                ? Math.Round(
                                    reviews.Average(
                                        review =>
                                            review.Rating),
                                    2)
                                : 0,

                        TotalReviews =
                            reviews.Count,

                        BestRatedProductId =
                            bestProduct?.ProductId,

                        BestRatedProductName =
                            bestProduct?.ProductName,

                        BestRatedProductAverageRating =
                            bestProduct == null
                                ? null
                                : Math.Round(
                                    bestProduct.Reviews
                                        .Average(
                                            review =>
                                                review.Rating),
                                    2),

                        LowOrZeroStockProducts =
                            business.Products.Count(
                                product =>
                                    product.StockQuantity <= 5),

                        LowStockThreshold = 5
                    };

                result.Add(dashboard);
            }

            return result;
        }
    }
}