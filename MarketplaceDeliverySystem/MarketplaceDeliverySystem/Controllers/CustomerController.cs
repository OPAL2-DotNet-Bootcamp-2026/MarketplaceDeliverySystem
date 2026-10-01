using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
namespace MarketplaceDeliverySystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Customer")]

    public class CustomerController : ControllerBase
    {
        private readonly CustomerService _customerService;

        public CustomerController(CustomerService customerService)
        {
            _customerService = customerService;
        }



        //[HttpGet("ViewOrderHistory/{customerId}")]
        //public IActionResult ViewOrderHistory(int customerId)
        //{
        //    List<OrderHistoryDTO> history = _customerService.ViewOrderHistory(customerId);

        //    if (history == null)
        //        return NotFound("Customer not found.");

        //    return Ok(history);
        //}




        [HttpGet("ViewOrderHistory")]
        public IActionResult ViewOrderHistory()
        {
            string? userIdValue =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdValue))
                return Unauthorized();

            int userId =
                int.Parse(userIdValue);

            List<OrderHistoryDTO> history =
                _customerService.ViewOrderHistory(userId);

            if (history == null)
                return NotFound(LocalizedText.Choose("Customer not found.", "لم يتم العثور على العميل."));

            return Ok(history);
        }














        [HttpPost("Register")]
        [AllowAnonymous]
        public IActionResult Register(RegisterCustomerDTO dto)
        {
            UserResponseDTO customer =
                _customerService.Register(dto);

            if (customer == null)
                return BadRequest(LocalizedText.Choose("Email already exists.", "البريد الإلكتروني مستخدم بالفعل."));

            return Ok(customer);
        }
    }
}
