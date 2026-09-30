using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MarketplaceDeliverySystem.Controllers
{
    [ApiController]
    //[controller] to declare the controller name automatically 
    [Route("api/[controller]")]
    public class BusinessController : ControllerBase
    {
        private readonly BusinessService _businessService;
        private readonly MarketplaceContext _context;

        public BusinessController(BusinessService businessService, MarketplaceContext context)
        {
            _businessService = businessService;
            _context = context;
        }

        [HttpGet("my-businesses")]
        [Authorize(Roles = "BusinessOwner")]
        public async Task<IActionResult> GetMyBusinesses()
        {
            if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
                return Unauthorized();

            var businesses = await _context.Businesses.AsNoTracking()
                .Where(b => b.BusinessOwner.UserId == userId)
                .OrderBy(b => b.BusinessName)
                .Select(b => new { b.BusinessId, b.BusinessName, b.BusinessNameAr })
                .ToListAsync();
            return Ok(businesses.Select(b => new
            {
                b.BusinessId,
                BusinessName = LocalizedText.Choose(b.BusinessName, b.BusinessNameAr)
            }));
        }

        [HttpPost("Register")]
        public IActionResult Register([FromBody]BusinessRegInputDTO dto)
        {
            _businessService.RegisterBusiness(dto);

            return Ok("Business registered successfully.");
        }

        [HttpGet("GetBestProductForEachBusiness")]
        [Authorize(Roles = "Customer")]
        public IActionResult GetBestProductForEachBusiness()
        {
            List<BestProductDTO> bestProducts =
                _businessService.GetBestProductForEachBusiness();

            return Ok(bestProducts);
        }
        [HttpGet("GetAllBusinessesWithProducts")]
        [Authorize(Roles = "Customer")]
        public IActionResult GetAllBusinessesWithProducts()
        {
            List<BusinessWithProductsRespDTO> businesses =
                _businessService.GetAllBusinessesWithProducts();

            return Ok(businesses);
        }

        [HttpGet("GetAllBusinesses")]
        [Authorize(Roles = "Customer")]
        public IActionResult GetAllBusinesses([FromQuery] int? categoryId = null)
        {
            List<BusinessCardRespDTO> result = _businessService.GetAllBusinesses(categoryId);
            return Ok(result);
        }

        [HttpGet("GetPopularBusinesses")]
        [AllowAnonymous]
        public IActionResult GetPopularBusinesses([FromQuery] int limit = 4)
        {
            List<PopularBusinessDTO> result = _businessService.GetPopularBusinesses(limit);
            return Ok(result);
        }
    }
}
