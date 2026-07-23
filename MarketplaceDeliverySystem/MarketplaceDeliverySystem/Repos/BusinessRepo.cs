using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
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

        public bool EmailExists(string email)
        {
            return _context.Businesses
                .Any(b => b.Email == email);
        }

        public Business? GetBusinessById(int businessId)
        {
            return _context.Businesses
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
    }
}
