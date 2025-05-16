using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductsController(StoreContext storeContext) : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        return await storeContext.Products.ToListAsync();
    }

    // GET api/<ProductsController>/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        Product? product = await storeContext.Products.FindAsync(id);
        if (product is null) 
            return NotFound();
        return product;
    }

    // POST api/<ProductsController>
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct([FromBody] Product product)
    {
        storeContext.Products.Add(product);
        await storeContext.SaveChangesAsync();
        return product;
    }

    // PUT api/<ProductsController>/5
    [HttpPut("{id}")]
    public async Task<ActionResult<Product>> UpdateProduct(int id, [FromBody] Product product)
    {
        if (product.Id != id || !ProductExists(id))
            return BadRequest("Cannot update this product.");
        storeContext.Entry(product).State = EntityState.Modified;
        await storeContext.SaveChangesAsync();
        return NoContent();
    }
    private bool ProductExists(int id) => storeContext.Products.Any(p => p.Id == id);

    // DELETE api/<ProductsController>/5
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        Product? product = await storeContext.Products.FindAsync(id);
        if (product is null)
            return NotFound();
        storeContext.Remove(product);
        await storeContext.SaveChangesAsync();
        return NoContent();
    }
}