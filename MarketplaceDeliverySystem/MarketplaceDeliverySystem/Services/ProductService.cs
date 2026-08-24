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

        public ProductUpdatedRespDTO UpdateProduct(int id, UpdateProductDTO dto)
        {
            var product = _productRepository.GetById(id);

            if (product == null)
                return null;

            // Update product: It replaces the old values with the new values received from the user
            product.ProductName = dto.ProductName;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.StockQuantity = dto.StockQuantity;



            _productRepository.Update();
            //Return the updated product
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
                Description =p.Description,
                Price = p.Price,
                BusinessName = p.Business.BusinessName,
                CategoryName = p.Category.CategoryName,
                StockQuantity = p.StockQuantity,
                ImageUrl = p.ImageUrl,
                IsAvailable = p.IsAvailable,
                AverageRating = p.Reviews.Any()
                    ? p.Reviews.Average(r => r.Rating)
                    : 0
            }).ToList();
        }

        public List<FilterProductsOutputDto> GetProductsByBusiness(int businessId, int? categoryId = null)
        {
            // 1. Fetch products of the business from the repository
            var products = _productRepository.GetProductsByBusinessId(businessId);

            // 2. Perform Category filtration here in the Service layer
            if (categoryId.HasValue && categoryId.Value > 0)
            {
                products = products.Where(p => p.CategoryId == categoryId.Value).ToList();
            }

            // 3. Map to DTO
            return products.Select(p => new FilterProductsOutputDto
            {
                ProductId = p.ProductId,
                ProductName = p.ProductName,
                Description = p.Description,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                ImageUrl = p.ImageUrl,
                IsAvailable = p.IsAvailable,
                BusinessName = p.Business?.BusinessName ?? string.Empty,
                CategoryName = p.Category?.CategoryName ?? string.Empty,
                AverageRating = p.Reviews.Any() ? p.Reviews.Average(r => r.Rating) : 0.0
            }).ToList();
        }

        public string DeleteProduct(int productId)
        {
            // Search using ProductId
            Product product = _productRepository.GetProductById(productId);


            if (product == null)
            {
                return "Product not found";
            }

            // Check if the product exists in OrderItems table
            bool ordered = _productRepository.IsProductOrdered(productId);

            // Delete if it has never been ordered 
            if (!ordered)
            {
                _productRepository.Delete(product);
                return "Product deleted successfully";
            }

            // Otherwise make the product unavailable
            product.IsAvailable = false;
            _productRepository.Update();

            return "Product deactivated successfully";
        }
    }
}
