using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Repos;

namespace MarketplaceDeliverySystem.Services
{
    public class OrderService
    {

        private readonly OrderRepo _orderRepo;
        private readonly OrderItemRepo _orderItemRepo;
        private readonly CustomerRepo _customerRepo;
        private readonly BusinessRepo _businessRepo;
        private readonly ProductRepo _productRepo;
        private readonly PaymentRepo _paymentRepo;
        private readonly DeliveryRepo _deliveryRepo;

        public OrderService(
            OrderRepo orderRepo,
            OrderItemRepo orderItemRepo,
            CustomerRepo customerRepo,
            BusinessRepo businessRepo,
            ProductRepo productRepo,
            PaymentRepo paymentRepo,
            DeliveryRepo deliveryRepo)
        {
            _orderRepo = orderRepo;
            _orderItemRepo = orderItemRepo;
            _customerRepo = customerRepo;
            _businessRepo = businessRepo;
            _productRepo = productRepo;
            _paymentRepo = paymentRepo;
            _deliveryRepo = deliveryRepo;
        }

        public Order? CreateOrder(OrderCreateDTO dto)
        {
            // Check if customer exists
            Customer? customer =
                _customerRepo.GetCustomerById(dto.CustomerId);

            if (customer == null)
            {
                return null;
            }

            // Check if business exists
            Business? business =
                _businessRepo.GetBusinessById(dto.BusinessId);

            if (business == null)
            {
                return null;
            }

            // Check if business is open
            if (!business.IsOpen)
            {
                return null;
            }

            // Order must contain at least one product
            if (dto.OrderItems == null || dto.OrderItems.Count == 0)
            {
                return null;
            }

            decimal subtotal = 0;

            // Validate all products before saving the order
            foreach (OrderItemCreateDTO itemDto in dto.OrderItems)
            {
                Product? product =
                    _productRepo.GetById(itemDto.ProductId);

                if (product == null)
                {
                    return null;
                }

                // Product must belong to the selected business
                if (product.BusinessId != dto.BusinessId)
                {
                    return null;
                }

                // Product must be available
                if (!product.IsAvailable)
                {
                    return null;
                }

                // Quantity must be between 1 and 999
                if (itemDto.Quantity < 1 || itemDto.Quantity > 999)
                {
                    return null;
                }

                // Check available stock
                if (product.StockQuantity < itemDto.Quantity)
                {
                    return null;
                }

                subtotal += product.Price * itemDto.Quantity;
            }

            // Create the order
            Order order = new Order
            {
                CustomerId = dto.CustomerId,
                BusinessId = dto.BusinessId,
                OrderDate = DateTime.UtcNow,
                Subtotal = subtotal,
                DeliveryFee = 0.700m,
                TotalAmount = subtotal + 0.700m,
                Status = "Pending"
            };

            // Use Add if this is the method name in your OrderRepo
            _orderRepo.AddOrder(order);

            // Create order items and reduce product stock
            foreach (OrderItemCreateDTO itemDto in dto.OrderItems)
            {
                Product? product =
                    _productRepo.GetById(itemDto.ProductId);

                if (product == null)
                {
                    return null;
                }

                OrderItem orderItem = new OrderItem
                {
                    OrderId = order.OrderId,
                    ProductId = product.ProductId,
                    Quantity = itemDto.Quantity,
                    UnitPrice = product.Price
                };

                // Use Add if this is the method name in OrderItemRepo
                _orderItemRepo.AddOrderItem(orderItem);

                product.StockQuantity -= itemDto.Quantity;

                if (product.StockQuantity == 0)
                {
                    product.IsAvailable = false;
                }

                // ProductRepo saves tracked product changes
                _productRepo.Update();
            }

            // Create payment
            Payment payment = new Payment
            {
                OrderId = order.OrderId,
                PaymentMethod = dto.PaymentMethod,
                PaymentStatus = "Pending",
                Amount = order.TotalAmount,
                PaymentDate = DateTime.UtcNow
            };

            _paymentRepo.AddPayment(payment);

            // Create delivery
            Delivery delivery = new Delivery
            {
                OrderId = order.OrderId,
                DeliveryStatus = "Waiting for Driver"
            };

            _deliveryRepo.AddDelivery(delivery);
            return order;
        }
    }
}
