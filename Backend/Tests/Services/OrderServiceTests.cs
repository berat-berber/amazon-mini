using amazonmini;
using amazonmini.DTOs;
using amazonmini.Services;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace AmazonMini.Tests.Services;

public class OrderServiceTests
{
    [Theory]
    [InlineData(0, typeof(ArgumentException))]
    [InlineData(16, typeof(InvalidOperationException))]
    public async Task CreateOrderAsync_ShouldRejectOrder_WhenItemQuantityIsZeroOrExceedsAvailableStock(
        int requestedQuantity,
        Type expectedExceptionType)
    {
        // Arrange
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        await using var context = await CreateContextAsync(connection);
        var service = new OrderService(context);
        var request = CreateOrderRequest("p-monitor", requestedQuantity);
        int initialStock = 15;

        // Act
        var exception = await Record.ExceptionAsync(() => service.CreateOrderAsync(request));

        // Assert
        Assert.IsType(expectedExceptionType, exception);
        Assert.Empty(await context.Orders.ToListAsync());
        Assert.Empty(await context.OrderItems.ToListAsync());
        Assert.Equal(initialStock, (await context.Products.FindAsync("p-monitor"))!.Quantity);
    }

    [Fact]
    public async Task CreateOrderAsync_ShouldDecreaseProductStock_WhenOrderIsCreated()
    {
        // Arrange
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        await using var context = await CreateContextAsync(connection);
        var service = new OrderService(context);
        var request = CreateOrderRequest("p-monitor", 3);
        int initialStock = 15;

        // Act
        var response = await service.CreateOrderAsync(request);

        // Assert
        Assert.Equal(initialStock - 3, (await context.Products.FindAsync("p-monitor"))!.Quantity);
        Assert.Single(await context.Orders.ToListAsync());
        var persistedItem = Assert.Single(await context.OrderItems.ToListAsync());
        Assert.Equal(response.Id, persistedItem.OrderId);
        Assert.Equal(3, persistedItem.Quantity);
    }

    private static async Task<AppDbContext> CreateContextAsync(SqliteConnection connection)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(connection)
            .Options;

        var context = new AppDbContext(options);
        await context.Database.EnsureCreatedAsync();
        return context;
    }

    private static CreateOrderRequest CreateOrderRequest(string productId, int quantity) => new()
    {
        CustomerName = "Test Customer",
        Items =
        [
            new CreateOrderItemRequest
            {
                ProductId = productId,
                Quantity = quantity
            }
        ]
    };
}
