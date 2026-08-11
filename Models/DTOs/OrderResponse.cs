namespace amazonmini.DTOs;

public class OrderResponse
{
    public string Id { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public decimal TotalAmount => Items.Sum(i => i.Quantity * i.PriceDuringOrder);
    public List<OrderItemResponse> Items { get; set; } = new();
}

public class OrderItemResponse
{
    public string ProductId { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal PriceDuringOrder { get; set; }
}
