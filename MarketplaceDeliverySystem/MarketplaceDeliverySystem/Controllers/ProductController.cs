using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Mvc;

namespace MarketplaceDeliverySystem.Controllers;

[ApiController]
[Route("api/products")]
[Produces("application/json")]
public class ProductsController : ControllerBase
{
    private readonly ProductService _productService;

    public ProductsController(
        ProductService productService)
    {
        _productService = productService;
    }

    [Authorize(
        Roles = UserRoles.BusinessOwner + "," + UserRoles.Admin)]
    [HttpPost]
    [ProducesResponseType(
        typeof(AddProductOutputDTO),
        StatusCodes.Status201Created)]
    [ProducesResponseType(
        StatusCodes.Status400BadRequest)]
    [ProducesResponseType(
        StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(
        StatusCodes.Status403Forbidden)]
    [ProducesResponseType(
        StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AddProductOutputDTO>>
        AddProduct(
            [FromBody] AddProductInputDTO input)
    {
        AddProductOutputDTO result =
            await _productService.AddProductAsync(input);

        return Created(
            $"/api/products/{result.ProductId}",
            result);
    }
}