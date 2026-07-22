using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Repos;

namespace MarketplaceDeliverySystem.Services
{
    public class CustomerService
    {
        private readonly CustomerRepo _customerRepository;

        public CustomerService(CustomerRepo customerRepository) {
            _customerRepository = customerRepository;

        }
        public List<OrderHistoryDTO> ViewOrderHistory(int customerId)
        {
            Customer customer = _customerRepository.GetCustomerById(customerId);

            if (customer == null)
                return null;

            List<Order> orders = _customerRepository.GetCustomerOrders(customerId);

            //return the response
            //.select= we need to convert each Order into an OrderHistoryDTO
            //For every order (o), create a new OrderHistoryDTO
            return orders.Select(o => new OrderHistoryDTO
            {
                OrderId = o.OrderId,

                OrderDate = o.OrderDate,

                OrderStatus = o.Status.ToString(),

                TotalAmount = o.TotalAmount,

                PaymentStatus = o.Payment.PaymentStatus.ToString(),

                DeliveryStatus = o.Delivery.DeliveryStatus.ToString(),
                //inner select = convert each OrderItem into an OrderItemHistoryDTO

                Products = o.OrderItems.Select(item => new OrderItemHistoryDTO
                {
                    ProductName = item.Product.ProductName,

                    Quantity = item.Quantity,

                    UnitPrice = item.UnitPrice

                }).ToList()

            }).ToList();
        }
    }
}
