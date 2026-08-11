using Microsoft.EntityFrameworkCore;

namespace amazonmini;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; } = null!;
    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<OrderItem> OrderItems { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OrderItem>()
            .HasKey(oi => new { oi.OrderId, oi.ProductId });

        modelBuilder.Entity<Product>().HasData(
            new Product("p-monitor", "27\" 4K Monitor", 329.99m, 15),
            new Product("p-keyboard", "Mechanical Keyboard", 119.99m, 25),
            new Product("p-mouse", "Wireless Mouse", 49.99m, 40),
            new Product("p-headset", "Noise-Cancelling Headset", 199.99m, 18),
            new Product("p-webcam", "1080p Webcam", 69.99m, 30),
            new Product("p-docking-station", "USB-C Docking Station", 149.99m, 12),
            new Product("p-ssd", "1TB External SSD", 109.99m, 22),
            new Product("p-usb-hub", "7-in-1 USB-C Hub", 39.99m, 50),
            new Product("p-speakers", "2.1 Desktop Speakers", 89.99m, 20),
            new Product("p-monitor-stand", "Ergonomic Monitor Stand", 59.99m, 35));
    }
}
