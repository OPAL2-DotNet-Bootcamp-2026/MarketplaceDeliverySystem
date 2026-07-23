using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Repos;

namespace MarketplaceDeliverySystem.Services
{
    public class BusinessService
    {
        private readonly BusinessRepo _businessRepository;
        private readonly BusinessOwnerRepo _ownerRepository;

        public BusinessService(BusinessRepo businessRepository, BusinessOwnerRepo ownerRepository)
        {
            _businessRepository = businessRepository;
            _ownerRepository = ownerRepository;
        }

        public void RegisterBusiness(BusinessRegInputDTO dto)
        {
            // Check if owner exists
            var owner = _ownerRepository.GetById(dto.OwnerId);

            if (owner == null)
                throw new Exception("Business owner not found.");

            // Validate business hours
            if (dto.OpeningTime >= dto.ClosingTime)
                throw new Exception("Opening time must be earlier than closing time.");

            // Check duplicate business email
            if (_businessRepository.EmailExists(dto.Email))
                throw new Exception("Business email already exists.");

            // Create business
            Business business = new Business
            {
                OwnerId = dto.OwnerId,
                BusinessName = dto.BusinessName,
                Description = dto.Description,
                LogoUrl = dto.LogoUrl,
                Email = dto.Email,
                Address = dto.Address,
                OpeningTime = dto.OpeningTime,
                ClosingTime = dto.ClosingTime,
                IsOpen = true
            };

            _businessRepository.Add(business);
        }
        
        public List<BusinessWithProductsRespDTO> GetAllBusinessesWithProducts()
        {
            //businesses contains a list of Business objects.
            List <Business> businesses = _businessRepository.GetAllBusinessesWithProducts();
            
            //Convert each Business into a DTO
            return businesses.Select(b => new BusinessWithProductsRespDTO
            {

                BusinessName = b.BusinessName,

                Address = b.Address,

                Email = b.Email,

                ProductCount = b.Products.Count,

                Products = b.Products.Select(p => new BusinessProductRespDTO
                {

                    ProductName = p.ProductName,

                    Price = p.Price,

                    StockQuantity = p.StockQuantity,

                    IsAvailable = p.StockQuantity > 0,

                    //Does this product have any reviews? if yes calculate the average 
                    // product has reviews and Review class includes rating
                    AverageRating = p.Reviews.Any()
                        ? p.Reviews.Average(r => r.Rating)
                        : 0 // if no will be 0

                }).ToList()

            }).ToList();
        }


        public List<BestProductDTO> GetBestProductForEachBusiness()
        {
            List<BestProductDTO> result = new List<BestProductDTO>();

            var businesses = _businessRepository.GetBusinessesProductsReviews();

            foreach (var business in businesses)
            {
                var bestProduct = business.Products
                    .OrderByDescending(p => p.Reviews.Count == 0 ? 0 : p.Reviews.Average(r => r.Rating))
                    .FirstOrDefault();

                if (bestProduct != null)
                {
                    result.Add(new BestProductDTO
                    {
                        BusinessName = business.BusinessName,
                        ProductName = bestProduct.ProductName,
                        AverageRating = bestProduct.Reviews.Count == 0
                            ? 0
                            : bestProduct.Reviews.Average(r => r.Rating),
                        NumberOfReviews = bestProduct.Reviews.Count
                    });
                }
            }

            return result;
        
    }
    }
    }

