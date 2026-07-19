using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.Models
{
    public class BusinessOwner
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OwnerId { get; set; }

        [Required]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }
    }
}
