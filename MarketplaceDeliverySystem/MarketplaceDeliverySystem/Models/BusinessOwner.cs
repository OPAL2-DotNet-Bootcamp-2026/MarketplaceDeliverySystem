using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.Models
{
    [Index(nameof(UserId), IsUnique = true)]
    [Index(nameof(NationalId), IsUnique = true)]
    public class BusinessOwner
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OwnerId { get; set; }

        [Required]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }
        public User User { get; set; }
        [Required]
        [MaxLength(20)]
        public string NationalId { get; set; }

        [MaxLength(50)]
        public string? BusinessLicense { get; set; }

        [Required]
        public DateTime JoinedAt { get; set; }
        

       
    }
}
