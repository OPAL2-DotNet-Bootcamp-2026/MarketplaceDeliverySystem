using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Mvc;

namespace MarketplaceDeliverySystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly CustomerService _customerService;

        public CustomerController(CustomerService customerService)
        {

        }
        [HttpGet("ViewOrderHistory/{customerId}")]
        public IActionResult ViewOrderHistory(int customerId)
        {
            List<OrderHistoryDTO> history = _customerService.ViewOrderHistory(customerId);

            if (history == null)
                return NotFound("Customer not found.");

            return Ok(history);
        }
    }
}
