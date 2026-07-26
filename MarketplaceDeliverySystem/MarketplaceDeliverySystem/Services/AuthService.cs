using MarketplaceDeliverySystem.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MarketplaceDeliverySystem.Services
{
    public class AuthService
    {
        private IConfiguration config;

        // IConfiguration reads values from appsettings.json.
        public AuthService(IConfiguration _config)
        {
            config = _config;
        }

        // This method creates a JWT token for the logged-in user.
        public string GenerateToken(User user)
        {
            string secretKey =
                config["JwtSettings:SecretKey"];

            string issuer =
                config["JwtSettings:Issuer"];

            string audience =
                config["JwtSettings:Audience"];

            int hours = int.Parse(
                config["JwtSettings:ExpiryHours"]);

            // Convert the secret key into bytes.
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(secretKey));

            // Define the signing algorithm.
            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            // Information stored inside the token.
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

            // Create the JWT token.
            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(hours),
                signingCredentials: credentials
            );

            // Convert the token object into a string.
            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }
    }
}