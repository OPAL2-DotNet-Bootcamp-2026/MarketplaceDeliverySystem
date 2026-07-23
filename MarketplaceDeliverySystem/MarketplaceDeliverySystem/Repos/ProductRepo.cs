using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using Microsoft.EntityFrameworkCore;

namespace MarketplaceDeliverySystem.Repos
{
    public class ProductRepo
    {
        private readonly MarketplaceContext _context;

        public ProductRepo(MarketplaceContext context)
        {
            _context = context;
        }

        public List<Product> GetAllProducts()
        {
            return _context.Products
                .Include(p => p.Business)
                .Include(p => p.Category)
                .Include(p => p.Reviews)
                .ToList();
        }

        public Product? GetById(int productId)
        {
            return _context.Products
                .FirstOrDefault(p => p.ProductId == productId);
        }

        public void Update()
        {
            _context.SaveChanges();
        }

        public List<Product> FilterProducts(FilterProductsDTO dto)
        {
            var products = _context.Products
                .Include(p => p.Business)
                .Include(p => p.Category)
                .Include(p => p.Reviews)
                .AsQueryable();

            // Category 
            if (dto.CategoryId.HasValue)
                products = products.Where(p => p.CategoryId == dto.CategoryId);

            // Business
            if (dto.BusinessId.HasValue)
                products = products.Where (p => p.BusinessId == dto.BusinessId);

            // MinPrice
            if (dto.MinPrice.HasValue)
                products = products.Where(p => p.Price >= dto.MinPrice);
            // MaxPrice
            if (dto.MaxPrice.HasValue)
                products = products.Where(p => p.Price <= dto.MaxPrice);

            // Availability
            if (dto.IsAvailable.HasValue)
                products = products.Where(p => p.IsAvailable == dto.IsAvailable);

            // Search by name
            if (!string.IsNullOrWhiteSpace(dto.ProductName))
                products = products.Where(p => p.ProductName.Contains(dto.ProductName));

            //
            if (dto.SortByPrice == "asc")
                products = products.OrderBy(p => p.Price);

            else if (dto.SortByPrice == "desc")
                products = products.OrderByDescending(p => p.Price);

            return products.ToList();
        }
    }
}
