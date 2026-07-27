using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
namespace MarketplaceDeliverySystem.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController: ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [AllowAnonymous]
        [EnableRateLimiting("authenticationPolicy")]
        [HttpPost("Login")]
        public IActionResult Login(LoginDTO dto)
        {
            LoginResponseDTO response =_userService.Login(dto);

            if (response == null)
                return Unauthorized();

            return Ok(response);
        }

        [HttpGet("GenerateHash")]
        [AllowAnonymous]
        public IActionResult GenerateHash()
        {
            string hash = BCrypt.Net.BCrypt.HashPassword("Admin123!");
            return Ok(hash);
        }
    }
}
