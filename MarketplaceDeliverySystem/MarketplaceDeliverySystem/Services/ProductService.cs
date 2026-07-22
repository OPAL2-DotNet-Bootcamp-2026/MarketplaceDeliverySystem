using MarketplaceDeliverySystem.Controllers;
using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Repos;

namespace MarketplaceDeliverySystem.Services
{
    public class ProductService
    {
        private readonly ProductRepo _productRepository;
        private readonly CategoryRepo _categoryRepository;

        public ProductService(ProductRepo productRepository, CategoryRepo categoryRepository)
        {
            _productRepository = productRepository;
            _categoryRepository = categoryRepository;
        }

        public void UpdateProduct(UpdateProductDTO dto)
        {
            // Check product exists
            var product = _productRepository.GetById(dto.ProductId);

            if (product == null)
                throw new Exception("Product not found.");

            // Check category exists
            var category = _categoryRepository.GetById(dto.CategoryId);

            if (category == null)
                throw new Exception("Category not found.");

            // Update product
            product.ProductName = dto.ProductName;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.StockQuantity = dto.StockQuantity;
            product.CategoryId = dto.CategoryId;

            _productRepository.Update(product);
        }
    }
}
