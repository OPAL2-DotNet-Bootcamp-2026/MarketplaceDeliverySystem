using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs
{
    public class OrderCreateDTO
    {
        [Range(1, int.MaxValue)]
        public int CustomerId { get; set; }

        [Range(1, int.MaxValue)]
        public int BusinessId { get; set; }

        [Required]
        public string PaymentMethod { get; set; } = string.Empty;

        [Required]
        [MinLength(1)]
        public List<OrderItemCreateDTO> OrderItems { get; set; }
            = new List<OrderItemCreateDTO>();
    }
}
