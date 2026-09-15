using MarketplaceDeliverySystem.Models;

namespace MarketplaceDeliverySystem.Repos
{
    public class BusinessCategoryRepo
    {
        private readonly MarketplaceContext context;

        public BusinessCategoryRepo(MarketplaceContext _context)
        {
            context = _context;
        }

        public BusinessCategory? GetById(int categoryId)
        {
            return context.BusinessCategories
                          .FirstOrDefault(c => c.BusinessCategoryId == categoryId);
        }

        public List<BusinessCategory> GetAll()
        {
            return context.BusinessCategories.ToList();
        }

        public BusinessCategory? GetByName(string name)
        {
            return context.BusinessCategories
                          .FirstOrDefault(c => c.BusinessCategoryName == name);
        }

        public void Add(BusinessCategory category)
        {
            context.BusinessCategories.Add(category);
            context.SaveChanges();
        }

        public void Update(BusinessCategory category)
        {
            context.BusinessCategories.Update(category);
            context.SaveChanges();
        }

        public void Delete(BusinessCategory category)
        {
            context.BusinessCategories.Remove(category);
            context.SaveChanges();
        }
    }
}
