using API.DTOs;
using API.Extentions;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class OrdersController(ICartService cartService, IUnitOfWork unitOfWork) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
    {
        string email = User.GetEmail();
        ShoppingCart? cart = cartService.GetCartAsync(orderDto.CartId).Result;
        if (cart is null)
            return BadRequest("Cart not found.");
        if (cart.PaymentIntentId is null)
            return BadRequest("No payment intent for this order.");

        List<OrderItem> items = new();
        foreach (var item in cart.Items)
        {
            Product? productItem = await unitOfWork.Repository<Product>().GetByIdAsync(item.ProductId);
            if (productItem is null)
                return BadRequest("Problem with the order.");

            ProductItemOrdered itemOrdered = new()
            {
                ProductId = item.ProductId,
                ProductName = item.ProductName,
                PictureUrl = item.PictureUrl,
            };
            OrderItem orderItem = new()
            {
                ItemOrdered = itemOrdered,
                Price = productItem.Price,
                Quantity = item.Quantity,
            };
            items.Add(orderItem);
        }

        DeliveryMethod? deliveryMethod = await unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(orderDto.DeliveryMethodId);

        if (deliveryMethod is null)
            return BadRequest("No delivery method selected.");

        Order order = new()
        {
            OrderItems = items,
            DeliveryMethod = deliveryMethod,
            ShippingAddress = orderDto.ShippingAddress,
            Subtotal = items.Sum(x => x.Price * x.Quantity),
            PaymentSummary = orderDto.PaymentSummary,
            PaymentIntentId = cart.PaymentIntentId,
            BuyerEmail = email,
        };
        unitOfWork.Repository<Order>().Add(order);
        if (await unitOfWork.Complete())
            return order;
        return BadRequest("Problem creating order.");
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<OrderDto>>> GetOrdersForUser()
    {
        OrderSpecification spec = new(User.GetEmail());
        var orders = await unitOfWork.Repository<Order>().GetAllAsync(spec);
        List<OrderDto> ordersToReturn = orders.Select(o => o.ToDto()).ToList();
        return Ok(ordersToReturn);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> GetOrderById(int id)
    {
        OrderSpecification spec = new(User.GetEmail(), id);
        var order = await unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        if (order is null) return NotFound();
        return Ok(order.ToDto());
    }
}