namespace Core.Entities.OrderAggregate;
public enum OrderStatus
{
    Pending = 0,
    PaymentReceived,
    PaymentFailed,
    PaymentMissmatch
}