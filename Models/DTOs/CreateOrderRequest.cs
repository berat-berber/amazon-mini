namespace amazonmini.DTOs;

public class CreateOrderRequest
{
    public string CustomerName { get; set; } = string.Empty;
    public List<CreateOrderItemRequest> Items { get; set; } = new();
}

public class CreateOrderItemRequest
{
    public string ProductId { get; set; } = string.Empty;
    public int Quantity { get; set; }
}
