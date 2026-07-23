using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using Microsoft.EntityFrameworkCore;

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

        public async Task<List<BestProductDTO>> GetBestProductForEachBusinessAsync()
        {
            var businesses = await _context.Businesses
                .Include(b => b.products)
                    .ThenInclude(p => p.Reviews)
                .ToListAsync();

            var result = new List<BestProductDTO>();

            foreach (var business in businesses)
            {
                var bestProduct = business.products
                    .Select(product => new
                    {
                        Product = product,
                        AverageRating = product.Reviews.Any()
                            ? product.Reviews.Average(r => r.Rating)
                            : 0,
                        ReviewCount = product.Reviews.Count
                    })
                    .OrderByDescending(x => x.AverageRating)
                    .ThenByDescending(x => x.ReviewCount)
                    .FirstOrDefault();

                if (bestProduct != null)
                {
                    result.Add(new BestProductDTO
                    {
                        BusinessName = business.BusinessName,
                        ProductName = bestProduct.Product.ProductName,
                        AverageRating =bestProduct.AverageRating,
                        NumberOfReviews = bestProduct.ReviewCount
                    });
                }
            }

            return result;
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
