using MarketplaceDeliverySystem.Controllers;
using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Repos;

namespace MarketplaceDeliverySystem.Services
{
    public class ProductService
    {
        private readonly ProductRepo _productRepository;
        

        public ProductService(ProductRepo productRepository)
        {
            _productRepository = productRepository;
            
        }

        public ProductUpdatedRespDTO UpdateProduct(int id,UpdateProductDTO dto)
        {
            var product = _productRepository.GetById(id);

            if (product == null)
                return null;

            // Update product
            product.ProductName = dto.ProductName;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.StockQuantity = dto.StockQuantity;

 

            _productRepository.Update();

            ProductUpdatedRespDTO response = new ProductUpdatedRespDTO
            {
                ProductId = product.ProductId,
                ProductName = product.ProductName,
                Description = product.Description,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
            };
            return response;
        }
        public List<FilterProductsOutputDto> FilterProducts(FilterProductsDTO dto)
        {
            List<Product> products = _productRepository.FilterProducts(dto);

            return products.Select(p => new FilterProductsOutputDto
            {
                ProductId = p.ProductId,
                ProductName = p.ProductName,
                Price = p.Price,
                BusinessName = p.Business.BusinessName,
                CategoryName = p.Category.CategoryName,
                IsAvailable = p.IsAvailable,
                AverageRating = p.Reviews.Any()
                    ? p.Reviews.Average(r => r.Rating)
                    : 0
            }).ToList();
        }
    }
}
