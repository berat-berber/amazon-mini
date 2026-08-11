namespace amazonmini;

public class Product
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public string Name { get; private set; } = string.Empty;

    public decimal Price { get; private set; } = 0;

    public int Quantity { get; private set; } = 0;

    public Product(string name, decimal price, int quantity)
    {
        if(price < 0)
        {
            throw new ArgumentException("Price cannot be negative");
        }

        if(quantity < 0)
        {
            throw new ArgumentException("Quantity cannot be negative");
        }

        if(string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Name cannot be empty");
        }
        
        Name = name;
        Price = price;
        Quantity = quantity;

    }
}
