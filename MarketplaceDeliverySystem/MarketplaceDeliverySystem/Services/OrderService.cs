using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Repos;

namespace MarketplaceDeliverySystem.Services
{
    public class OrderService
    {
        private readonly OrderRepo _orderRepo;

        public OrderService(OrderRepo orderRepo)
        {
            _orderRepo = orderRepo;
        }

        public UpdateOrderStatusOutputDTO UpdateOrderStatus(
            int orderId,
            UpdateOrderStatusDTO dto)
        {
            Order? order =
                _orderRepo.GetOrderWithDelivery(orderId);

            if (order == null)
            {
                throw new Exception("Order not found.");
            }

            if (order.Delivery == null)
            {
                throw new Exception(
                    "Delivery record not found.");
            }

            string newStatus =
                dto.NewStatus.Trim().ToLower();

            switch (newStatus)
            {
                case "pending":

                    order.Status = "Pending";

                    order.Delivery.DeliveryStatus =
                        "Waiting for Driver";

                    break;

                case "preparing":

                    order.Status = "Preparing";

                    order.Delivery.DeliveryStatus =
                        "Waiting for Driver";

                    break;

                case "ready":

                    order.Status = "Ready";

                    order.Delivery.DeliveryStatus =
                        "Waiting for Driver";

                    break;

                case "out for delivery":

                    order.Status = "Out For Delivery";

                    order.Delivery.DeliveryStatus =
                        "On The Way";

                    break;

                case "delivered":

                    order.Status = "Delivered";

                    order.Delivery.DeliveryStatus =
                        "Completed";

                    order.Delivery.DeliveredTime =
                        DateTime.UtcNow;

                    break;

                case "cancelled":

                    order.Status = "Cancelled";

                    order.Delivery.DeliveryStatus =
                        "Cancelled";

                    break;

                default:

                    throw new Exception(
                        "Invalid order status.");
            }

            _orderRepo.SaveChanges();

            return new UpdateOrderStatusOutputDTO
            {
                OrderId = order.OrderId,
                OrderStatus = order.Status,
                DeliveryId = order.Delivery.DeliveryId,
                DeliveryStatus =
                    order.Delivery.DeliveryStatus
            };
        }
    }
}