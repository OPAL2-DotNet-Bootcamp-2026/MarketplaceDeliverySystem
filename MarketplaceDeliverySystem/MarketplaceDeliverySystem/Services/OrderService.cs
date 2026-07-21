using MarketplaceDeliverySystem.DTOs;
using MarketplaceDeliverySystem.Models;
using MarketplaceDeliverySystem.Repos;

namespace MarketplaceDeliverySystem.Services
{
    public class OrderService
    {

        private OrderRepo _orderRepo;
        private OrderItemRepo _orderItemRepo;
        private CustomerRepo _customerRepo;
        private BusinessRepo _businessRepo;
        private ProductRepo _productRepo;
        private PaymentRepo _paymentRepo;
        private DeliveryRepo _deliveryRepo;

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

        public Order CreateOrder(OrderCreateDTO dto)
        {
            // Check if customer exists
            Customer customer =
                _customerRepo.GetCustomerById(dto.CustomerId);

            if (customer == null)
                return null;

            // Check if business exists
            Business business =
                _businessRepo.GetBusinessById(dto.BusinessId);

            if (business == null)
                return null;

            // Check if business is open
            if (business.IsOpen == false)
                return null;

            // Order must contain at least one item
            if (dto.OrderItems == null ||
                dto.OrderItems.Count == 0)
            {
                return null;
            }

            decimal subtotal = 0;

            // Validate all products before creating the order
            foreach (OrderItemCreateDTO itemDto in dto.OrderItems)
            {
                Product product =
                    _productRepo.GetProductById(itemDto.ProductId);

                // Check if product exists
                if (product == null)
                    return null;

                // Check product belongs to selected business
                if (product.BusinessId != dto.BusinessId)
                    return null;

                // Check product is available
                if (product.IsAvailable == false)
                    return null;

                // Check requested quantity
                if (itemDto.Quantity < 1 ||
                    itemDto.Quantity > 999)
                {
                    return null;
                }

                // Check sufficient stock
                if (product.StockQuantity < itemDto.Quantity)
                    return null;

                subtotal += product.Price * itemDto.Quantity;
            }

            // Create order
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

            // Save first to generate OrderId
            _orderRepo.AddOrder(order);

            // Create order items and reduce stock
            foreach (OrderItemCreateDTO itemDto in dto.OrderItems)
            {
                Product product =
                    _productRepo.GetProductById(itemDto.ProductId);

                OrderItem orderItem = new OrderItem
                {
                    OrderId = order.OrderId,
                    ProductId = product.ProductId,
                    Quantity = itemDto.Quantity,
                    UnitPrice = product.Price
                };

                _orderItemRepo.AddOrderItem(orderItem);

                product.StockQuantity -= itemDto.Quantity;

                if (product.StockQuantity == 0)
                {
                    product.IsAvailable = false;
                }

                _productRepo.UpdateProduct(product);
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
