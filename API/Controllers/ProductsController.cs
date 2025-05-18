using Core.Entities;
using Core.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductsController(IProductRepository _productRepository) : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetProducts(string? brand, string? type, string? sort) => Ok(await _productRepository.GetProductsAsync(brand, type, sort));

    // GET api/<ProductsController>/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        Product? product = await _productRepository.GetProductByIdAsync(id);
        if (product is null) 
            return NotFound();
        return product;
    }

    // POST api/<ProductsController>
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct([FromBody] Product product)
    {
        _productRepository.AddProduct(product);
        if (await _productRepository.SaveChangesAsync())
            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        return BadRequest("Can't create a product.");
    }

    // PUT api/<ProductsController>/5
    [HttpPut("{id}")]
    public async Task<ActionResult<Product>> UpdateProduct(int id, [FromBody] Product product)
    {
        if (product.Id != id || !ProductExists(id))
            return BadRequest("Cannot update this product.");
        _productRepository.UpdateProduct(product);

        if (await _productRepository.SaveChangesAsync())
            return NoContent();

        return BadRequest("Problem updating product.");
    }

    // DELETE api/<ProductsController>/5
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        Product? product = await _productRepository.GetProductByIdAsync(id);
        if (product is null)
            return NotFound();
        _productRepository.DeleteProduct(product);

        if(await _productRepository.SaveChangesAsync())
            return NoContent();

        return BadRequest("Problem deleting product.");
    }

    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetBrands() 
    {
        return Ok(await _productRepository.GetBrandAsync());
    }

    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetTypes()
    {
        return Ok(await _productRepository.GetTypesAsync());
    }

    private bool ProductExists(int id) => _productRepository.ProductExists(id);
}