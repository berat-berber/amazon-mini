namespace amazonmini;

public class Order
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public string CustomerName { get; private set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Order(string customerName)
    {
        if(string.IsNullOrWhiteSpace(customerName))
        {
            throw new ArgumentException("Customer name cannot be empty");
        }

        CustomerName = customerName;
    }

}
