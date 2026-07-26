using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Repos;
using BCrypt.Net;
namespace MarketplaceDeliverySystem.Services
{
    public class BusinessOwnerService
    {
            private readonly UserRepo _userRepo;
            private readonly BusinessOwnerRepo _businessOwnerRepo;

            public BusinessOwnerService(UserRepo userRepo, BusinessOwnerRepo businessOwnerRepo)
            {
                _userRepo = userRepo;
                _businessOwnerRepo = businessOwnerRepo;
            }

            public UserResponseDTO Register(RegBusinessOwnerDTO dto)
            {
            // Validation
            if (_userRepo.EmailExists(dto.Email))
                return null;

                if (_businessOwnerRepo.NationalIdExists(dto.NationalId))
              {
                return null;
              }
            User user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                PhoneNumber = dto.PhoneNumber,
                ProfileImage = dto.ProfileImage,
                Role = "BusinessOwner",
                RegistrationDate = DateTime.UtcNow,
                IsActive = true
            };

            _userRepo.Add(user);

            // Create BusinessOwner
            BusinessOwner owner = new BusinessOwner
            {
                UserId = user.UserId,
                NationalId = dto.NationalId,
                BusinessLicense = dto.BusinessLicense,
                JoinedAt = DateTime.UtcNow
            };

            _businessOwnerRepo.Add(owner);

            return new UserResponseDTO
            {
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role
            };
        }
        }
    }
