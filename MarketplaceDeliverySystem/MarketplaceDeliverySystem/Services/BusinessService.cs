using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Repos;

namespace MarketplaceDeliverySystem.Services
{
    public class BusinessService
    {
        private readonly BusinessRepo _businessRepository;
        private readonly BusinessOwnerRepo _ownerRepository;

        public BusinessService(BusinessRepo businessRepository, BusinessOwnerRepo ownerRepository)
        {
            _businessRepository = businessRepository;
            _ownerRepository = ownerRepository;
        }

        public void RegisterBusiness(BusinessRegInputDTO dto)
        {
            // Check if owner exists
            var owner = _ownerRepository.GetById(dto.OwnerId);

            if (owner == null)
                throw new Exception("Business owner not found.");

            // Validate business hours
            if (dto.OpeningTime >= dto.ClosingTime)
                throw new Exception("Opening time must be earlier than closing time.");

            // Check duplicate business email
            if (_businessRepository.EmailExists(dto.Email))
                throw new Exception("Business email already exists.");

            // Create business
            Business business = new Business
            {
                OwnerId = dto.OwnerId,
                BusinessName = dto.BusinessName,
                Description = dto.Description,
                LogoUrl = dto.LogoUrl,
                Email = dto.Email,
                Address = dto.Address,
                OpeningTime = dto.OpeningTime,
                ClosingTime = dto.ClosingTime,
                IsOpen = true
            };

            _businessRepository.Add(business);
        }
    }
}
