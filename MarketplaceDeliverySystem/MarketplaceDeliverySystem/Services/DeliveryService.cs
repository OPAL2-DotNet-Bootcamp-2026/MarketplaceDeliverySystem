using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Repos;

namespace MarketplaceDeliverySystem.Services
{
    public class DeliveryService
    {
        private readonly DeliveryRepo _deliveryRepo;
        private readonly DriverRepo _driverRepo;

        public DeliveryService(
            DeliveryRepo deliveryRepo,
            OrderRepo orderRepo,
            DriverRepo driverRepo)
        {
            _deliveryRepo = deliveryRepo;
            _driverRepo = driverRepo;

        }
        public Delivery? GetMyDelivery(int userId)
        {
            return _deliveryRepo.GetAssignedDeliveryByUserId(userId);
        }
        public DriverAssignToDeliveryOutputDTO?
            AssignDriverToDelivery(int deliveryId, int driverId)
        {
            // Check if delivery exists
            Delivery? delivery =
                _deliveryRepo.GetById(deliveryId);

            if (delivery == null)
            {
                return null;
            }

            // Check if order is ready for delivery
            if (delivery.Order.Status != "Ready")
            {
                return null;
            }

            // Check if driver exists
            Driver? driver =
                _driverRepo.GetDriverById(driverId);

            if (driver == null)
            {
                return null;
            }

            // Check if driver is available
            if (driver.AvailabilityStatus != "Available")
            {
                return null;
            }

            // Assign driver to delivery
            delivery.DriverId = driver.DriverId;
            delivery.DeliveryStatus = "Assigned";
            //order.Status = "Ready";
            //_orderRepo.AddOrder(order);

            // Change driver status
            driver.AvailabilityStatus = "Busy";

            delivery.Order.Status = "On the Way";

            delivery.PickupTime = DateTime.UtcNow;
            // Save changes
            _deliveryRepo.Update();
            _driverRepo.Save();

            return new DriverAssignToDeliveryOutputDTO
            {
                OrderId = delivery.OrderId,
                FullName = driver.User.FullName,
                PhoneNumber = driver.User.PhoneNumber
            };
        }
  
    public MessageOutputDTO UpdateDeliveryStatus(
    int deliveryId,
    UpdateOrderStatusDTO dto)
        {
            // Find the delivery with its Order and Driver.
            Delivery? delivery =
                _deliveryRepo.GetById(deliveryId);

            if (delivery == null)
            {
                return new MessageOutputDTO
                {
                    Success = false,
                    Message = "Delivery was not found."
                };
            }

            // Remove extra spaces from the entered status.
            string newStatus = dto.Status.Trim();

            // =====================================================
            // DRIVER COMPLETES THE DELIVERY
            // =====================================================

            if (newStatus == "Delivered")
            {
                // The delivery must be On The Way first.
                if (delivery.DeliveryStatus != "Assigned")
                {
                    return new MessageOutputDTO
                    {
                        Success = false,
                        Message =
                           "The delivery must be Assigned before it can be Delivered."
                    };
                }

                // Update the order and delivery.
                delivery.DeliveryStatus = "Delivered";
                delivery.Order.Status = "Delivered";

                // Record the delivery completion time.
                delivery.DeliveredTime = DateTime.UtcNow;

                // Calculate delivery duration in minutes.
                delivery.DeliveryDuration =
                    (decimal)(
                        delivery.DeliveredTime -
                        delivery.PickupTime
                    ).TotalMinutes;

                // The driver can receive another delivery.
                delivery.Driver.AvailabilityStatus = "Available";

                _deliveryRepo.Update();

                return new MessageOutputDTO
                {
                    Success = true,
                    Message =
                        "Order delivered successfully. Driver is available again."
                };
            }

            // Reject statuses outside this workflow.
            return new MessageOutputDTO
            {
                Success = false,
                Message =
                    "Status must be 'Delivered'."
            };
        }
    }
}

