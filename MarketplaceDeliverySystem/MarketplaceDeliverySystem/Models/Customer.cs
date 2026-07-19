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

        [ForeignKey(nameof(User)),Required]
        public int UserId { get; set; }
        public User User { get; set; }


        [Required]
        [MaxLength(20)]
        public string NationalId { get; set; }

        [MaxLength(50)]
        public string? BusinessLicense { get; set; }

        [Required]
        [MaxLength(20)]
        public string VerificationStatus { get; set; }

        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Order> Orders { get; set; } = new List<Order>();

    }
}
