using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketplaceDeliverySystem.Models
{
    public class Driver
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DriverId { get; set; }

        [Required]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }
        public User User { get; set; }

        [Required]
        [MaxLength(30)]
        public string LicenseNumber { get; set; }

        [Required]
        [MaxLength(30)]
        public string VehicleType { get; set; }

        [Required]
        [MaxLength(20)]
        public string VehiclePlateNumber { get; set; }

        [Required]
        [MaxLength(20)]
        public string AvailabilityStatus { get; set; }

        public decimal? CurrentLatitude { get; set; }

        public decimal? CurrentLongitude { get; set; }

        [Required]
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>();

    }
}
