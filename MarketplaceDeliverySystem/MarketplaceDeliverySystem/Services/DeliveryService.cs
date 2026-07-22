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
            DriverRepo driverRepo)
        {
            _deliveryRepo = deliveryRepo;
            _driverRepo = driverRepo;
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

            // Change driver status
            driver.AvailabilityStatus = "Busy";

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
    }
}
