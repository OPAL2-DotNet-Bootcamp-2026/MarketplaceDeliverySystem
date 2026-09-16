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

        public List<BusinessCategory> GetAllCategories()
        {
            return _businesscategoryRepo.GetAll();
        }

        public BusinessCategory? GetCategoryById(int id)
        {
            return _businesscategoryRepo.GetById(id);
        }
    }
}
