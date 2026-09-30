using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Services;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace MarketplaceDeliverySystem.Repos
{
    public class BusinessRepo
    {
        private readonly MarketplaceContext _context;

        public BusinessRepo(MarketplaceContext context)
        {
            _context = context;
        }

        public void Add(Business business)
        {
            _context.Businesses.Add(business);
            _context.SaveChanges();
        }
        public List<Business> GetAllBusinesses()
        {
            return _context.Businesses
                .Include(b => b.businessCategory)
                .ToList();
        }

        public List<PopularBusinessDTO> GetPopularBusinesses(int limit)
        {
            int safeLimit = Math.Clamp(limit, 1, 12);

            var businesses = _context.Businesses
                .AsNoTracking()
                .Select(b => new
                {
                    b.BusinessId,
                    b.BusinessName,
                    b.BusinessNameAr,
                    CategoryName = b.businessCategory == null
                        ? null
                        : b.businessCategory.BusinessCategoryName,
                    CategoryNameAr = b.businessCategory == null
                        ? null
                        : b.businessCategory.BusinessCategoryNameAr,
                    b.LogoUrl,
                    b.Address,
                    b.OpeningTime,
                    b.ClosingTime,
                    b.IsOpen,
                    OrderCount = _context.Orders.Count(o =>
                        o.BusinessId == b.BusinessId && o.Status != "Cancelled")
                })
                .OrderByDescending(b => b.OrderCount)
                .ThenBy(b => b.BusinessName)
                .Take(safeLimit)
                .ToList();

            return businesses.Select(b => new PopularBusinessDTO
            {
                BusinessId = b.BusinessId,
                BusinessName = LocalizedText.Choose(b.BusinessName, b.BusinessNameAr),
                BusinessCategoryName = b.CategoryName == null
                    ? null
                    : LocalizedText.Choose(b.CategoryName, b.CategoryNameAr),
                LogoUrl = b.LogoUrl,
                Address = b.Address,
                OpeningTime = b.OpeningTime,
                ClosingTime = b.ClosingTime,
                IsOpen = b.IsOpen,
                OrderCount = b.OrderCount
            }).ToList();
        }

        public bool EmailExists(string email)
        {
            return _context.Businesses
                .Any(b => b.Email == email);
        }

        public Business? GetBusinessById(int businessId)
        {
            return _context.Businesses
                .Include(b => b.businessCategory)
                .Include(b => b.BusinessOwner)
                    .ThenInclude(bo => bo.User)
                .FirstOrDefault(b => b.BusinessId == businessId);
        }

        //Loading all businesses,Loading the products belonging to each business. Loading the reviews belonging to each product.
        public List<Business> GetBusinessesProductsReviews()
        {
            return _context.Businesses
                .Include(b => b.Products)
                .ThenInclude(p => p.Reviews)
                .ToList();
        }

        // returns A list of Business objects include products of each business.
        public List<Business> GetAllBusinessesWithProducts()
        {
            //load each business with its products.
            return _context.Businesses
                .Include(b => b.Products)
                .ToList();//converts the result into a C# list = List<Business>
        }

        public List<Business> GetBusinessesByCategoryId(int categoryId)
        {
            return _context.Businesses
                .Include(b => b.businessCategory)
                .Where(b => b.BusinessCategoryId == categoryId)
                .ToList();
        }
    }
}
