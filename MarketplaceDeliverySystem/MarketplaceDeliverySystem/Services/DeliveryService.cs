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
        public DriverAssignToDeliveryOutputDTO?
    AssignNextReadyDelivery()
        {
            // Find a Ready delivery without a driver
            Delivery? delivery =
                _deliveryRepo.GetNextReadyDelivery();

            if (delivery == null)
            {
                return null;
            }

            // Find an available driver
            Driver? driver =
                _driverRepo.GetAvailableDriver();

            if (driver == null)
            {
                return null;
            }

            // Assign driver to delivery
            delivery.DriverId = driver.DriverId;
            delivery.DeliveryStatus = "Assigned";

            // Driver becomes busy
            driver.AvailabilityStatus = "Busy";

            // Order becomes On the Way
            delivery.Order.Status = "On the Way";

            // Record pickup/assignment time
            delivery.PickupTime = DateTime.UtcNow;
            // Save the assignment
            _deliveryRepo.Update();

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

            string newStatus = dto.Status.Trim();

            if (newStatus == "Delivered")
            {
                if (delivery.DeliveryStatus != "Assigned")
                {
                    return new MessageOutputDTO
                    {
                        Success = false,
                        Message =
                            "The delivery must be Assigned before it can be Delivered."
                    };
                }

                if (delivery.PickupTime == null)
                {
                    return new MessageOutputDTO
                    {
                        Success = false,
                        Message =
                            "Pickup time was not recorded for this delivery."
                    };
                }

                // ==========================================
                // COMPLETE CURRENT DELIVERY
                // ==========================================

                delivery.DeliveryStatus = "Delivered";
                delivery.Order.Status = "Delivered";

                delivery.DeliveredTime = DateTime.UtcNow;

                delivery.DeliveryDuration =
                    (decimal)(
                        delivery.DeliveredTime.Value -
                        delivery.PickupTime.Value
                    ).TotalMinutes;

                // ==========================================
                // DRIVER BECOMES AVAILABLE
                // ==========================================

                if (delivery.Driver != null)
                {
                    delivery.Driver.AvailabilityStatus = "Available";
                }

                // Save current delivery + available driver
                _deliveryRepo.Update();

                // ==========================================
                // FIND NEXT READY ORDER
                // ==========================================

                DriverAssignToDeliveryOutputDTO? nextDelivery =
                    AssignNextReadyDelivery();

                if (nextDelivery != null)
                {
                    return new MessageOutputDTO
                    {
                        Success = true,
                        Message =
                            $"Order delivered successfully. " +
                            $"Driver has been automatically assigned to Order {nextDelivery.OrderId}."
                    };
                }

                return new MessageOutputDTO
                {
                    Success = true,
                    Message =
                        "Order delivered successfully. Driver is available again."
                };
            }

            return new MessageOutputDTO
            {
                Success = false,
                Message = "Status must be 'Delivered'."
            };
        }
        public DriverAssignToDeliveryOutputDTO?
    AssignAvailableDriver(int deliveryId)
        {
            // Find delivery
            Delivery? delivery =
                _deliveryRepo.GetById(deliveryId);

            if (delivery == null)
            {
                return null;
            }

            // Order must be Ready
            if (delivery.Order.Status != "Ready")
            {
                return null;
            }

            // Don't assign another driver
            if (delivery.DriverId != null)
            {
                return null;
            }

            // Find an available driver
            Driver? driver =
                _driverRepo.GetAvailableDriver();

            if (driver == null)
            {
                return null;
            }

            // Assign driver
            delivery.DriverId = driver.DriverId;
            delivery.DeliveryStatus = "Assigned";

            // Driver becomes busy
            driver.AvailabilityStatus = "Busy";

            // Order is now on the way
            delivery.Order.Status = "On the Way";

            // Record pickup/assignment time
            delivery.PickupTime = DateTime.UtcNow;

            // Save
            _deliveryRepo.Update();

            return new DriverAssignToDeliveryOutputDTO
            {
                OrderId = delivery.OrderId,
                FullName = driver.User.FullName,
                PhoneNumber = driver.User.PhoneNumber
            };
        }
    }
}

