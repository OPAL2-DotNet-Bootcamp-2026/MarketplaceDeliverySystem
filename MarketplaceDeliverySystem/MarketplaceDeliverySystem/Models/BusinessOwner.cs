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
        public int OwnerId { get; set; } // System Generated

        [Required]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; } //From List (Created/Selected User)

        public User User { get; set; } //Navigation Property
        [Required(ErrorMessage = "National ID is required.")]
        [MaxLength(20)]
        public string NationalId { get; set; } //User Input

        [MaxLength(50)]
        public string? BusinessLicense { get; set; } // User Input

        [Required]
        public DateTime JoinedAt { get; set; } //System Generated
    }
}
