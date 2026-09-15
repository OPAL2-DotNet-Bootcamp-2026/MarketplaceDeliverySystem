using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.Models
{
    public class BusinessCategory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BusinessCategoryId { get; set; } //System Generated 

        [Required]
        public string BusinessCategoryName { get; set; } //User Input

        [Url]
        public string? BusinessCategoryImageURL { get; set; } //User Input

        public ICollection<Business> businesses { get; set; } = new List<Business>(); //navigation properties
    }
}
