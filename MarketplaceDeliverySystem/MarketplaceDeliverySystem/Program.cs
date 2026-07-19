
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Repos;
using MarketplaceDeliverySystem.Services;
using Microsoft.EntityFrameworkCore;

namespace MarketplaceDeliverySystem
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            // 1 - register context
            builder.Services.AddDbContext<MarketplaceContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("")));

            // service lifetime
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

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
