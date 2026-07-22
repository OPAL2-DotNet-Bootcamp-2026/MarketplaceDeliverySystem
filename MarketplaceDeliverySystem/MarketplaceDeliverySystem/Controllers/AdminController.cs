using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MarketplaceDeliverySystem.Controllers
{
    [ApiController]
    [Route("statistics")]
    [Authorize(Roles = "Admin")]
    public class StatisticsController : ControllerBase
    {
        private readonly AdminService _adminService;

        public StatisticsController(AdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("marketplace")]
        public IActionResult GetMarketplaceStatistics()
        {
            MarketplaceStatisticsOutputDTO result =
                _adminService.GetMarketplaceStatistics();

            return Ok(result);
        }
    }
}