using MarketplaceDeliverySystem.Models;

namespace MarketplaceDeliverySystem.Repos
{

        public class DriverRepo
        {
            private MarketplaceContext context;

            public DriverRepo(MarketplaceContext _context)
            {
                context = _context;
            }

            public void AddDriver(Driver driver)
            {
                context.Drivers.Add(driver);
                context.SaveChanges();
            }

            public Driver? GetDriverByLicenseNumber(string licenseNumber)
            {
                return context.Drivers
                    .FirstOrDefault(d => d.LicenseNumber == licenseNumber);
            }

            public Driver? GetDriverByVehiclePlate(string plateNumber)
            {
                return context.Drivers
                    .FirstOrDefault(d => d.VehiclePlateNumber == plateNumber);
            }

            public void Save()
            {
                context.SaveChanges();
            }
        }
    }