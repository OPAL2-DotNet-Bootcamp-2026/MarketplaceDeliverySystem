using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.Models
{
    [Index(nameof(UserId), IsUnique = true)]
    public class Customer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CustomerId { get; set; }
        //System Generated 

        [Required]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }
        //From List (Created/Selected User)

        public User User { get; set; }
        //Navigation Property

        [Required]
        public DateTime CreatedAt { get; set; }
        //System Generated (DateTime.Now)

        [Required]
        public string Address { get; set; }
        // User Input

        public ICollection<Order> Orders { get; set; } = new List<Order>();
        //Navigation Property

        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        //Navigation Property
    }
}