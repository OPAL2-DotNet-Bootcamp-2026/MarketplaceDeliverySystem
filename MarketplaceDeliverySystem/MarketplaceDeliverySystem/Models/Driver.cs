using Microsoft.EntityFrameworkCore;
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

        [Required(ErrorMessage = "Licence number is required.")]
        [MaxLength(30)]
        public string LicenseNumber { get; set; }//User Input

        [Required(ErrorMessage = "Vehicle type is required.")]
        [MaxLength(30)]
        public string VehicleType { get; set; }//User Input

        [Required(ErrorMessage = "Vehicle plate number is required.")]
        [MaxLength(20)]
        public string VehiclePlateNumber { get; set; }//User Input

        [Required(ErrorMessage = "Availability status is required.")]
        [MaxLength(20)]
        public string AvailabilityStatus { get; set; }//(Default = "Available")

        [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90.")]
        [Precision(9, 6)]
        public decimal? CurrentLatitude { get; set; }

        [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180.")]
        [Precision(9, 6)]
        public decimal? CurrentLongitude { get; set; }

        [Required]
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;//System Generated 

    }
}
