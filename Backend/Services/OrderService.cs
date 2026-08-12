using amazonmini;
using amazonmini.DTOs;
using Microsoft.EntityFrameworkCore;

namespace amazonmini.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;

    public OrderService(AppDbContext context) => _context = context;

    public async Task<OrderResponse> CreateOrderAsync(CreateOrderRequest request)
    {
        if(string.IsNullOrWhiteSpace(request.CustomerName))
        {
            throw new ArgumentException("Customer name cannot be empty");
        }

        if(request.Items is null || request.Items.Count == 0)
        {
            throw new ArgumentException("Order must contain at least one item");
        }

        var order = new Order(request.CustomerName);
        var orderItems = new List<OrderItem>();
        var itemResponses = new List<OrderItemResponse>();

        foreach (var item in request.Items)
        {
            if(item.Quantity <= 0)
            {
                throw new ArgumentException($"Quantity for product {item.ProductId} must be greater than zero");
            }

            var product = await _context.Products.FindAsync(item.ProductId);

            if(product is null)
            {
                throw new KeyNotFoundException($"Product '{item.ProductId}' not found");
            }

            if(product.Quantity < item.Quantity)
            {
                throw new InvalidOperationException($"Insufficient stock for '{product.Name}'");
            }

            product.DecrementStock(item.Quantity);

            orderItems.Add(new OrderItem(order.Id, product.Id, item.Quantity, product.Price));
            itemResponses.Add(new OrderItemResponse
            {
                ProductId = product.Id,
                ProductName = product.Name,
                Quantity = item.Quantity,
                PriceDuringOrder = product.Price
            });
        }

        _context.Orders.Add(order);
        _context.OrderItems.AddRange(orderItems);
        await _context.SaveChangesAsync();

        return new OrderResponse
        {
            Id = order.Id,
            CustomerName = order.CustomerName,
            CreatedAt = order.CreatedAt,
            Items = itemResponses
        };
    }

    public async Task<OrderResponse?> GetOrderAsync(string id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order is null)
        {
            return null;
        }

        var items = await _context.OrderItems
            .Where(i => i.OrderId == id)
            .Include(i => i.Product)
            .ToListAsync();

        return new OrderResponse
        {
            Id = order.Id,
            CustomerName = order.CustomerName,
            CreatedAt = order.CreatedAt,
            Items = items.Select(i => new OrderItemResponse
            {
                ProductId = i.ProductId,
                ProductName = i.Product.Name,
                Quantity = i.Quantity,
                PriceDuringOrder = i.PriceDuringOrder
            }).ToList()
        };
    }

    public async Task<List<OrderResponse>> GetOrdersAsync()
    {
        var orders = await _context.Orders.ToListAsync();
        var responses = new List<OrderResponse>();

        foreach (var order in orders)
        {
            var items = await _context.OrderItems
                .Where(i => i.OrderId == order.Id)
                .Include(i => i.Product)
                .ToListAsync();

            responses.Add(new OrderResponse
            {
                Id = order.Id,
                CustomerName = order.CustomerName,
                CreatedAt = order.CreatedAt,
                Items = items.Select(i => new OrderItemResponse
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Quantity = i.Quantity,
                    PriceDuringOrder = i.PriceDuringOrder
                }).ToList()
            });
        }

        return responses;
    }
}
