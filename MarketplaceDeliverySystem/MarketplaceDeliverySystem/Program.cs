using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Repos;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace MarketplaceDeliverySystem
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // =====================================================
            // 1. REGISTER DATABASE CONTEXT
            // =====================================================

            builder.Services.AddDbContext<MarketplaceContext>(options =>options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection")));

            // =====================================================
            // 2. REGISTER REPOSITORIES
            // =====================================================

            builder.Services.AddScoped<ProductRepo>();
            builder.Services.AddScoped<UserRepo>();
            builder.Services.AddScoped<BusinessOwnerRepo>();
            builder.Services.AddScoped<BusinessRepo>();
            builder.Services.AddScoped<CategoryRepo>();
            builder.Services.AddScoped<CustomerRepo>();
            builder.Services.AddScoped<DeliveryRepo>();
            builder.Services.AddScoped<DriverRepo>();
            builder.Services.AddScoped<OrderItemRepo>();
            builder.Services.AddScoped<OrderRepo>();
            builder.Services.AddScoped<PaymentRepo>();
            builder.Services.AddScoped<ReviewRepo>();
            builder.Services.AddScoped<AdminRepo>();

            // =====================================================
            // 3. REGISTER SERVICES
            // =====================================================

            builder.Services.AddScoped<ProductService>();
            builder.Services.AddScoped<UserService>();
            builder.Services.AddScoped<BusinessOwnerService>();
            builder.Services.AddScoped<BusinessService>();
            builder.Services.AddScoped<CategoryService>();
            builder.Services.AddScoped<CustomerService>();
            builder.Services.AddScoped<DeliveryService>();
            builder.Services.AddScoped<DriverService>();
            builder.Services.AddScoped<OrderItemService>();
            builder.Services.AddScoped<OrderService>();
            builder.Services.AddScoped<PaymentService>();
            builder.Services.AddScoped<ReviewService>();
            builder.Services.AddScoped<AdminService>();
            // Email sending service
            builder.Services.AddScoped<EmailService>();
            // AuthService generates JWT tokens.
            builder.Services.AddScoped<AuthService>();

            // =====================================================
            // 4. READ JWT SETTINGS FROM appsettings.json
            // =====================================================

            string jwtKey =
                builder.Configuration["JwtSettings:SecretKey"]
                ?? throw new InvalidOperationException(
                    "JWT SecretKey is missing in appsettings.json.");

            string jwtIssuer =
                builder.Configuration["JwtSettings:Issuer"]
                ?? throw new InvalidOperationException(
                    "JWT Issuer is missing in appsettings.json.");

            string jwtAudience =
                builder.Configuration["JwtSettings:Audience"]
                ?? throw new InvalidOperationException(
                    "JWT Audience is missing in appsettings.json.");

            // =====================================================
            // 5. CONFIGURE JWT AUTHENTICATION
            // =====================================================

            builder.Services
                .AddAuthentication(
                    JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters =
                        new TokenValidationParameters
                        {
                            // Check who created the token.
                            ValidateIssuer = true,

                            // Check who the token is intended for.
                            ValidateAudience = true,

                            // Reject expired tokens.
                            ValidateLifetime = true,

                            // Verify the token signature.
                            ValidateIssuerSigningKey = true,

                            // Values from appsettings.json.
                            ValidIssuer = jwtIssuer,
                            ValidAudience = jwtAudience,

                            // Secret key used to validate the token.
                            IssuerSigningKey =
                                new SymmetricSecurityKey(
                                    Encoding.UTF8.GetBytes(jwtKey))
                        };
                });

            // Enables [Authorize] and role authorization.
            builder.Services.AddAuthorization();

            // =====================================================
            // 6. REGISTER CONTROLLERS AND OPENAPI
            // =====================================================

            builder.Services.AddControllers();

            //builder.Services.AddOpenApi();

            // All service registrations must be above Build().
            var app = builder.Build();

            // =====================================================
            // 7. CONFIGURE HTTP PIPELINE
            // =====================================================

            if (app.Environment.IsDevelopment())
            {
                //app.MapOpenApi();
            }

            app.UseHttpsRedirection();

            // First, read and validate the JWT token.
            app.UseAuthentication();

            // Then, check [Authorize] and roles.
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}