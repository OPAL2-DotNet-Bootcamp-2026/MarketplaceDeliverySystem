using MarketplaceDeliverySystem.Controllers;
using MarketplaceDeliverySystem.DTOs;
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
    }
}
