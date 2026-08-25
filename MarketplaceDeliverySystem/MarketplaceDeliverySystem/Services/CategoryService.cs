namespace MarketplaceDeliverySystem.Services
{
    public class CategoryService
    {

        private readonly CategoryRepo _categoryRepo;

        public CategoryService(CategoryRepo categoryRepo)
        {
            _categoryRepo = categoryRepo;
        }
    }
}
