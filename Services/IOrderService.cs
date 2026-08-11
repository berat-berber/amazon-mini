using amazonmini;

namespace amazonmini.Services;

public interface IOrderService
{
    Task<Order> CreateOrderAsync(string customerName, IReadOnlyDictionary<string, int> items);
}
