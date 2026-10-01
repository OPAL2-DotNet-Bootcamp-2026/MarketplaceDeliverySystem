using System.ComponentModel.DataAnnotations;

namespace MarketplaceDeliverySystem.DTOs;

public sealed class CreateProductDTO : UpdateProductDTO
{
    [Range(1, int.MaxValue)]
    public int BusinessId { get; set; }

    [Range(1, int.MaxValue)]
    public int CategoryId { get; set; }

    [MaxLength(300)]
    public string? ImageUrl { get; set; }
}
