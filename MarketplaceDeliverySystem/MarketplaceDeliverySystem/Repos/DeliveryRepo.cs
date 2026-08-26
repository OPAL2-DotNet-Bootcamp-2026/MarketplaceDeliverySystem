using MarketplaceDeliverySystem.Models;
using Microsoft.EntityFrameworkCore;

namespace MarketplaceDeliverySystem.Repos
{
   public class DeliveryRepo
        {
            private readonly MarketplaceContext _context;

            public DeliveryRepo(MarketplaceContext context)
            {
                _context = context;
            }

        public Delivery? GetById(int deliveryId)
        {
            return _context.Deliveries
                .Include(d => d.Order)
                .Include(d => d.Driver)
                .FirstOrDefault(d =>
                    d.DeliveryId == deliveryId);
        }
        public Delivery? GetByOrderId(int orderId)
        {
            return _context.Deliveries
                .FirstOrDefault(d => d.OrderId == orderId);
        }
        public Delivery? GetAssignedDeliveryByUserId(int userId)
        {
            return _context.Deliveries
                .Include(d => d.Order)
                .Include(d => d.Driver)
                .Where(d =>
                    d.Driver != null &&
                    d.Driver.UserId == userId &&
                    d.DeliveryStatus == "Assigned" &&
                    d.Order.Status == "On the Way")
                .OrderByDescending(d => d.PickupTime)
                .FirstOrDefault();
        }
        public void Update()
            {
                _context.SaveChanges();
            }
        public Delivery? GetNextReadyDelivery()
        {
            return _context.Deliveries
                .Include(d => d.Order)
                .Where(d =>
                    d.Order.Status == "Ready" &&
                    d.DriverId == null)
                .OrderBy(d => d.Order.OrderDate)
                .FirstOrDefault();
        }
        public void AddDelivery(Delivery delivery)
        {
            _context.Deliveries.Add(delivery);
            _context.SaveChanges();
        }

    }
    }
