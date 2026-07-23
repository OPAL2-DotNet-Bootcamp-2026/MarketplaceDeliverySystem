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

        public CustomerController(
            CustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpPost("Register")]
        public IActionResult Register(
            [FromBody] RegisterCustomerDTO dto)
        {
            try
            {
                RegisterCustomerOutputDTO result =
                    _customerService.RegisterCustomer(dto);

                return Ok(result);
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }
    }
}
