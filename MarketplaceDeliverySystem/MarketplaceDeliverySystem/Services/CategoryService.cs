using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Repos;

namespace MarketplaceDeliverySystem.Services
{
    public class CategoryService
    {

        private readonly CategoryRepo _categoryRepo;

        public CategoryService(CategoryRepo categoryRepo)
        {
            _categoryRepo = categoryRepo;
        }

        public List<CategorySidebarDTO> GetSidebarCategories()
        {
            var categories = _categoryRepo.GetAllCategories();

            return categories.Select(c => new CategorySidebarDTO
            {
                CategoryId = c.CategoryId,
                CategoryName = c.CategoryName
            }).ToList();
        }
    }
}
