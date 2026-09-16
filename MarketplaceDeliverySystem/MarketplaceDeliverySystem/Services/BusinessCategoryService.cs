using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Repos;

namespace MarketplaceDeliverySystem.Services
{
    public class BusinessCategoryService
    {
        private readonly BusinessCategoryRepo _businesscategoryRepo;

        public BusinessCategoryService(BusinessCategoryRepo businesscategoryRepo)
        {
            _businesscategoryRepo = businesscategoryRepo;
        }

        public List<CategorySidebarDTO> GetSidebarCategories()
        {
            var categories = _businesscategoryRepo.GetAll();

            return categories.Select(c => new CategorySidebarDTO
            {
                CategoryId = c.BusinessCategoryId,
                CategoryName = c.BusinessCategoryName
            }).ToList();
        }
    }
}
