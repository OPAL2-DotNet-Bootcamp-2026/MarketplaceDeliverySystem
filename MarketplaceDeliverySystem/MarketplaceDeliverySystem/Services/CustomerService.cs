using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Repos;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MarketplaceDeliverySystem.Services
{
    public class CustomerService
    {
        private readonly UserRepo _userRepo;
        private readonly CustomerRepo _customerRepo;
        private readonly IConfiguration _configuration;

        public CustomerService(
            UserRepo userRepo,
            CustomerRepo customerRepo,
            IConfiguration configuration)
        {
            _userRepo = userRepo;
            _customerRepo = customerRepo;
            _configuration = configuration;
        }

        public RegisterCustomerOutputDTO RegisterCustomer(
            RegisterCustomerDTO dto)
        {
            string email = dto.Email.Trim().ToLower();

            // Check whether email already exists
            if (_userRepo.EmailExists(email))
            {
                throw new Exception("Email already exists.");
            }

            // Hash password
            string hashedPassword =
                BCrypt.Net.BCrypt.HashPassword(dto.Password);

            // Create user
            User user = new User
            {
                FullName = dto.FullName,
                Email = email,
                PasswordHash = hashedPassword,
                PhoneNumber = dto.PhoneNumber,
                Role = "Customer",
                RegistrationDate = DateTime.UtcNow,
                IsActive = true
            };

            // Save user first to generate UserId
            _userRepo.Add(user);

            // Create customer profile
            Customer customer = new Customer
            {
                UserId = user.UserId,
                Address = dto.Address,
                CreatedAt = DateTime.UtcNow
            };

            // Save customer
            _customerRepo.Add(customer);

            DateTime expiryDate =
                DateTime.UtcNow.AddHours(2);

            string token =
                GenerateToken(user, expiryDate);

            return new RegisterCustomerOutputDTO
            {
                CustomerId = customer.CustomerId,
                UserId = user.UserId,
                Role = user.Role,
                Token = token,
                ExpiresAtUtc = expiryDate
            };
        }

        private string GenerateToken(
            User user,
            DateTime expiryDate)
        {
            string jwtKey =
                _configuration["Jwt:Key"]!;

            string jwtIssuer =
                _configuration["Jwt:Issuer"]!;

            string jwtAudience =
                _configuration["Jwt:Audience"]!;

            Claim[] claims =
            {
                new Claim(
                    ClaimTypes.NameIdentifier,
                    user.UserId.ToString()),

                new Claim(
                    ClaimTypes.Name,
                    user.FullName),

                new Claim(
                    ClaimTypes.Email,
                    user.Email),

                new Claim(
                    ClaimTypes.Role,
                    user.Role)
            };

            SymmetricSecurityKey key =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtKey));

            SigningCredentials credentials =
                new SigningCredentials(
                    key,
                    SecurityAlgorithms.HmacSha256);

            JwtSecurityToken token =
                new JwtSecurityToken(
                    issuer: jwtIssuer,
                    audience: jwtAudience,
                    claims: claims,
                    expires: expiryDate,
                    signingCredentials: credentials);

            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }
    }
}
