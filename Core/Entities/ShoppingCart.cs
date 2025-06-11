
namespace Core.Entities;
public class ShoppingCart
{
    public string Id { get; set; }
    public List<CartItems> Items { get; set; } = [];
}
