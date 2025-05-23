using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductsController(IRepository<Product> _repo) : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetProducts(string? brand, string? type, string? sort)
    {
        ProductSpecification spec = new(brand, type, sort);
        IReadOnlyList<Product> products = await _repo.GetAllAsync(spec);
        return Ok(products);
    }

    // GET api/<ProductsController>/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        Product? product = await _repo.GetByIdAsync(id);
        if (product is null) 
            return NotFound();
        return product;
    }

    // POST api/<ProductsController>
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct([FromBody] Product product)
    {
        _repo.Add(product);
        if (await _repo.SaveAllAsync())
            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        return BadRequest("Can't create a product.");
    }

    // PUT api/<ProductsController>/5
    [HttpPut("{id}")]
    public async Task<ActionResult<Product>> UpdateProduct(int id, [FromBody] Product product)
    {
        if (product.Id != id || !ProductExists(id))
            return BadRequest("Cannot update this product.");
        _repo.Update(product);

        if (await _repo.SaveAllAsync())
            return NoContent();

        return BadRequest("Problem updating product.");
    }

    // DELETE api/<ProductsController>/5
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        Product? product = await _repo.GetByIdAsync(id);
        if (product is null)
            return NotFound();
        _repo.Remove(product);

        if(await _repo.SaveAllAsync())
            return NoContent();

        return BadRequest("Problem deleting product.");
    }

    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetBrands() 
    {
        var spec = new BrandListSpecification();
        return Ok(await _repo.GetAllAsync(spec));
    }

    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetTypes()
    {
        var spec = new TypeListSpecification();
        return Ok(await _repo.GetAllAsync(spec));
    }

    private bool ProductExists(int id) => _repo.Exists(id);
}