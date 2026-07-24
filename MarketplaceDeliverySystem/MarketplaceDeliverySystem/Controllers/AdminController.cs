using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Mvc;

namespace MarketplaceDeliverySystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly AdminService _adminService;

        public AdminController(
            AdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("BusinessDashboard")]
        public IActionResult BusinessDashboard()
        {
            List<BusinessDashboardOutputDTO> result =
                _adminService.GetBusinessDashboard();

            return Ok(result);
        }
    }
}