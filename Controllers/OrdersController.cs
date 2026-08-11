using amazonmini.DTOs;
using amazonmini.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace amazonmini;

[Route("api/orders")]
[ApiController]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IMemoryCache _cache;

    private static readonly MemoryCacheEntryOptions Options = new()
    {
        SlidingExpiration = TimeSpan.FromMinutes(1),
        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
    };

    public OrdersController(IOrderService orderService, IMemoryCache cache)
    {
        _orderService = orderService;
        _cache = cache;
    }

    [HttpGet]
    public async Task<ActionResult<List<OrderResponse>>> GetOrders()
    {
        var orders = await _cache.GetOrCreateAsync("orders:all", async entry =>
        {
            entry.SetOptions(Options);
            return await _orderService.GetOrdersAsync();
        });

        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderResponse>> GetOrder(string id)
    {
        var order = await _cache.GetOrCreateAsync($"order:{id}", async entry =>
        {
            entry.SetOptions(Options);
            return await _orderService.GetOrderAsync(id);
        });

        if (order is null)
        {
            return NotFound();
        }
        return Ok(order);
    }

    [HttpPost]
    public async Task<ActionResult<OrderResponse>> CreateOrder(CreateOrderRequest request)
    {
        try
        {
            var order = await _orderService.CreateOrderAsync(request);

            _cache.Remove("orders:all");
            _cache.Remove("products:all");
            foreach (var item in request.Items)
            {
                _cache.Remove($"product:{item.ProductId}");
            }

            return Created(string.Empty, order);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
