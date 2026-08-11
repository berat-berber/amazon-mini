using amazonmini.DTOs;

namespace amazonmini.Services;

public interface IOrderService
{
    Task<OrderResponse> CreateOrderAsync(CreateOrderRequest request);
}
