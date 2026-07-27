using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MarketplaceDeliverySystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CustomerController : ControllerBase
    {
        private readonly CustomerService _customerService;

        public CustomerController(CustomerService customerService)
        {
            _customerService = customerService;
        }
        [HttpGet("ViewOrderHistory/{customerId}")]
        public IActionResult ViewOrderHistory(int customerId)
        {
            List<OrderHistoryDTO> history = _customerService.ViewOrderHistory(customerId);

            if (history == null)
                return NotFound("Customer not found.");

            return Ok(history);
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public IActionResult Register(RegisterCustomerDTO dto)
        {
            UserResponseDTO customer =
                _customerService.Register(dto);

            if (customer == null)
                return BadRequest("Email already exists.");

            return Ok(customer);
        }
    }
}
