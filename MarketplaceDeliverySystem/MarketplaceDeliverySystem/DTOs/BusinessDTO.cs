namespace MarketplaceDeliverySystem.DTOs
{
    public class BusinessWithProductsRespDTO
    {
        public string BusinessName { get; set; }

        public string Address { get; set; }

        public string Email { get; set; }

        public int ProductCount { get; set; }

        public List<BusinessProductRespDTO> Products { get; set; }
    }
}
