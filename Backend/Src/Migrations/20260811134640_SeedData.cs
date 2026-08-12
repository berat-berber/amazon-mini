using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace amazonmini.Migrations
{
    /// <inheritdoc />
    public partial class SeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Name", "Price", "Quantity" },
                values: new object[,]
                {
                    { "p-docking-station", "USB-C Docking Station", 149.99m, 12 },
                    { "p-headset", "Noise-Cancelling Headset", 199.99m, 18 },
                    { "p-keyboard", "Mechanical Keyboard", 119.99m, 25 },
                    { "p-monitor", "27\" 4K Monitor", 329.99m, 15 },
                    { "p-monitor-stand", "Ergonomic Monitor Stand", 59.99m, 35 },
                    { "p-mouse", "Wireless Mouse", 49.99m, 40 },
                    { "p-speakers", "2.1 Desktop Speakers", 89.99m, 20 },
                    { "p-ssd", "1TB External SSD", 109.99m, 22 },
                    { "p-usb-hub", "7-in-1 USB-C Hub", 39.99m, 50 },
                    { "p-webcam", "1080p Webcam", 69.99m, 30 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "p-docking-station");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "p-headset");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "p-keyboard");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "p-monitor");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "p-monitor-stand");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "p-mouse");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "p-speakers");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "p-ssd");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "p-usb-hub");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "p-webcam");
        }
    }
}
