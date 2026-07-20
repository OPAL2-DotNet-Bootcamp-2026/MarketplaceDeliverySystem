using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.Models
{
    public class Driver
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DriverId { get; set; }//System Generated

        [Required]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }//From List (Created/Selected User)
        public User User { get; set; }//Navigation Property

        [Required]
        [MaxLength(30)]
        public string LicenseNumber { get; set; }//User Input

        [Required]
        [MaxLength(30)]
        public string VehicleType { get; set; }//User Input

        [Required]
        [MaxLength(20)]
        public string VehiclePlateNumber { get; set; }//User Input

        [Required]
        [MaxLength(20)]
        public string AvailabilityStatus { get; set; }//(Default = "Available")

        public decimal? CurrentLatitude { get; set; }// System Generated 

        public decimal? CurrentLongitude { get; set; }//System Generated 

        [Required]
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;//System Generated 

    }
}
