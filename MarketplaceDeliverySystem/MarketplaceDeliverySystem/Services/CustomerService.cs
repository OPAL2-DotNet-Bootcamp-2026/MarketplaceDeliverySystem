using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Repos;

namespace MarketplaceDeliverySystem.Services
{
    public class CustomerService
    {
        private readonly CustomerRepo _customerRepository;
        private readonly UserRepo _userRepository;

        public CustomerService(CustomerRepo customerRepository, UserRepo userRepository) {
            _customerRepository = customerRepository;
            _userRepository = userRepository;

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
        //send the registeration info and receive back the reg comfirmation
        public UserResponseDTO Register(RegisterCustomerDTO dto)
        {
            if (_userRepository.EmailExists(dto.Email))
                return null;

            User user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                PhoneNumber = dto.PhoneNumber,
                ProfileImage = dto.ProfileImage,
                Role = "Customer",
                RegistrationDate = DateTime.UtcNow,
                IsActive = true
            };

            _userRepository.Add(user);

            Customer customer = new Customer
            {
                UserId = user.UserId,
                Address = dto.Address,
                CreatedAt = DateTime.UtcNow
            };

            _customerRepository.AddCustomer(customer);

            return new UserResponseDTO
            {
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role
            };
        }
    }
}
