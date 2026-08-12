namespace amazonmini;

public class OrderItem
{
    public string ProductId { get; private set; }
    public Product Product { get; set; } = null!;

    public string OrderId { get; private set; }
    public Order Order { get; set; } = null!;

    public int Quantity { get; private set; }

    public decimal PriceDuringOrder { get; private set; }

    public OrderItem(string orderId, string productId, int quantity, decimal priceDuringOrder)
    {

        if(string.IsNullOrWhiteSpace(orderId))
        {
            throw new ArgumentException("OrderId cannot be empty");
        }

        if(string.IsNullOrWhiteSpace(productId))
        {
            throw new ArgumentException("ProductId cannot be empty");
        }

        if(quantity <= 0)
        {
            throw new ArgumentException("Quantity must be greater than zero");
        }

        if(priceDuringOrder < 0)
        {
            throw new ArgumentException("Price during order cannot be negative");
        }

        OrderId = orderId;
        ProductId = productId;
        Quantity = quantity;
        PriceDuringOrder = priceDuringOrder;
    }

}
