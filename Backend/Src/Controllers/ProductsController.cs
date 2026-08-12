using amazonmini;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace amazonmini.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;

        private static readonly MemoryCacheEntryOptions Options = new()
        {
            SlidingExpiration = TimeSpan.FromSeconds(30),
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
        };

        public ProductsController(AppDbContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        [HttpGet]
        public async Task<ActionResult> GetProducts([FromQuery] string? search)
        {
            if (!string.IsNullOrWhiteSpace(search))
            {
                var matches = await _context.Products
                    .Where(p => EF.Functions.ILike(p.Name, $"%{search}%"))
                    .ToListAsync();
                return Ok(matches);
            }

            var products = await _cache.GetOrCreateAsync("products:all", async entry =>
            {
                entry.SetOptions(Options);
                return await _context.Products.ToListAsync();
            });

            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetProduct([FromRoute] string id)
        {
            var product = await _cache.GetOrCreateAsync($"product:{id}", async entry =>
            {
                entry.SetOptions(Options);
                return await _context.Products.FindAsync(id);
            });

            if (product == null)
            {
                return Problem(statusCode: 404, title: "Not Found", detail: "Product not found.");
            }
            return Ok(product);
        }
    }
}
