using amazonmini;
using Microsoft.EntityFrameworkCore;

namespace amazonmini.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;

    public OrderService(AppDbContext context) => _context = context;

    public async Task<Order> CreateOrderAsync(string customerName, IReadOnlyDictionary<string, int> items)
    {
        if(string.IsNullOrWhiteSpace(customerName))
        {
            throw new ArgumentException("Customer name cannot be empty");
        }

        if(items is null || items.Count == 0)
        {
            throw new ArgumentException("Order must contain at least one item");
        }

        var order = new Order(customerName);
        List<OrderItem> orderItems = new List<OrderItem>();

        foreach (var (productId, quantity) in items)
        {
            if(quantity <= 0)
            {
                throw new ArgumentException($"Quantity for product {productId} must be greater than zero");
            }

            var product = await _context.Products.FindAsync(productId);

            if (product is null)
                throw new KeyNotFoundException($"Product '{productId}' not found");

            product.DecrementStock(quantity);

            orderItems.Add(new OrderItem(order.Id, product.Id, quantity, product.Price));
        }

        _context.Orders.Add(order);
        _context.OrderItems.AddRange(orderItems);
        await _context.SaveChangesAsync();

        return order;
    }
}
