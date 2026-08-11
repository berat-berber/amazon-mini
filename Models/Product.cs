namespace amazonmini;

public class Product
{
    public string Id { get; set; }

    public string Name { get; private set; } = string.Empty;

    public decimal Price { get; private set; } = 0;

    public int Quantity { get; private set; } = 0;

    public Product(string id, string name, decimal price, int quantity)
    {
        if(string.IsNullOrWhiteSpace(id))
        {
            throw new ArgumentException("Id cannot be empty");
        }

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
        
        Id = id;
        Name = name;
        Price = price;
        Quantity = quantity;

    }
}
