using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Repos;

namespace MarketplaceDeliverySystem.Services
{
    public class ProductService
    {
        private readonly ProductRepo _productRepo;

        public ProductService(ProductRepo productRepo)
        {
            _productRepo = productRepo;
        }

        public async Task<AddProductOutputDTO> AddProductAsync(
            AddProductInputDTO input)
        {
            Business? business =
                await _productRepo.GetBusinessByIdAsync(
                    input.BusinessId);

            if (business == null)
            {
                throw new Exception("Business not found.");
            }

            Category? category =
                await _productRepo.GetCategoryByIdAsync(
                    input.CategoryId);

            if (category == null)
            {
                throw new Exception("Category not found.");
            }

            if (input.Price <= 0)
            {
                throw new Exception(
                    "Price must be greater than zero.");
            }

            if (input.StockQuantity < 0)
            {
                throw new Exception(
                    "Stock quantity cannot be negative.");
            }

            Product product = new Product
            {
                BusinessId = input.BusinessId,
                CategoryId = input.CategoryId,
                ProductName = input.ProductName,
                Description = input.Description,
                Price = input.Price,
                StockQuantity = input.StockQuantity,
                ImageUrl = input.ImageUrl,
                CreatedAt = DateTime.UtcNow,
                IsAvailable = true
            };

            await _productRepo.AddProductAsync(product);

            return new AddProductOutputDTO
            {
                ProductId = product.ProductId,
                BusinessId = product.BusinessId,
                CategoryId = product.CategoryId,
                ProductName = product.ProductName,
                IsAvailable = product.IsAvailable,
                CreatedAtUtc = product.CreatedAt
            };
        }
    }
}