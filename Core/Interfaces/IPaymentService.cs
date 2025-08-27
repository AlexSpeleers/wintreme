using Core.Entities;

namespace Core.Interfaces;
public interface IPaymentService
{
    public Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string cartId);
}
