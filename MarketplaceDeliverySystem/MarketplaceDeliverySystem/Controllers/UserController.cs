using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Mvc;

namespace MarketplaceDeliverySystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController: ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("Login")]
        public IActionResult Login(LoginDTO dto)
        {
            LoginResponseDTO response =_userService.Login(dto);

            if (response == null)
                return Unauthorized();

            return Ok(response);
        }
    }
}
