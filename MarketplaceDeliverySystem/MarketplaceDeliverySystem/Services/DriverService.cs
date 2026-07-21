using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Repos;

namespace MarketplaceDeliverySystem.Services
{
    public class DriverService
    {
        private DriverRepo _driverRepo;
        private UserRepo _userRepo;

        public DriverService(DriverRepo driverRepo, UserRepo userRepo)
        {
            _driverRepo = driverRepo;
            _userRepo = userRepo;
        }

        public Driver RegisterDriver(DriverRegDTO dto)
        {
            // Check if email already exists
            if (_userRepo.EmailExists(dto.Email))
                return null;

            // Check if license number already exists
            if (_driverRepo.GetDriverByLicenseNumber(dto.LicenseNumber) != null)
                return null;

            // Check if vehicle plate number already exists
            if (_driverRepo.GetDriverByVehiclePlate(dto.VehiclePlateNumber) != null)
                return null;

            User user = new User {
                FullName = dto.FullName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "Driver"
            };
            _userRepo.Add(user);

            Driver driver = new Driver();
            driver.UserId = user.UserId;
            driver.LicenseNumber = dto.LicenseNumber;
            driver.VehicleType = dto.VehicleType;
            driver.VehiclePlateNumber = dto.VehiclePlateNumber;
            driver.AvailabilityStatus = "Available";

            _driverRepo.AddDriver(driver);

            return driver;
        }
    }
}