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

            public void RegisterBusinessOwner(RegBusinessOwnerDTO dto)
            {
                // Validation
                if (_userRepo.EmailExists(dto.Email))
                    throw new Exception("Email already exists.");

                if (_businessOwnerRepo.NationalIdExists(dto.NationalId))
              {
                throw new Exception("National ID is already registered.");
              }
            // Hash the password
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);


            // Create User
            User user = new User
                {
                    FullName = dto.FullName,
                    Email = dto.Email,
                    PasswordHash = dto.Password,
                    Role = "BusinessOwner",
                    RegistrationDate = DateTime.UtcNow,
                    IsActive = true,
            };

                _userRepo.Add(user);

                // Create BusinessOwner
                BusinessOwner owner = new BusinessOwner
                {
                    UserId = user.UserId, 
                    NationalId = dto.NationalId,
                    BusinessLicense = dto.BusinessLicense,
                    JoinedAt = DateTime.UtcNow,
                    
                };

                _businessOwnerRepo.Add(owner);
            }
        }
    }
