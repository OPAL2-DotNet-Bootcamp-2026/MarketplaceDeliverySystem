using MarketplaceDeliverySystem.DTOs;
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

        public MarketplaceStatisticsOutputDTO
            GetMarketplaceStatistics()
        {
            return _adminRepo.GetMarketplaceStatistics();
        }
    }
}
