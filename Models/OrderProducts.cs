namespace amazonmini;

public class OrderProducts
{
    public string ProductId { get; set; } = string.Empty;
    public Product Product { get; set; }

    public string OrderId { get; set; } = string.Empty;
    public Order Order { get; set; }

    public int Quantity { get; private set; }

    public decimal PriceDuringOrder { get; private set; }

    public OrderProducts(int quantity, decimal priceDuringOrder)
    {

        if(quantity <= 0)
        {
            throw new ArgumentException("Quantity must be greater than zero");
        }

        if(priceDuringOrder < 0)
        {
            throw new ArgumentException("Price during order cannot be negative");
        }

        Quantity = quantity;
        PriceDuringOrder = priceDuringOrder;
    }

}
