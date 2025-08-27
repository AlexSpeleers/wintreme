using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ProductsController(IUnitOfWork unitOfWork) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetProducts([FromQuery] ProductSpecParams specParams)
    {
        ProductSpecification spec = new(specParams);
        return await CreatePagedResult(unitOfWork.Repository<Product>(), spec, specParams.PageIndex, specParams.PageSize);
    }

    // GET api/<ProductsController>/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        Product? product = await unitOfWork.Repository<Product>().GetByIdAsync(id);
        if (product is null)
            return NotFound();
        return product;
    }

    // POST api/<ProductsController>
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct([FromBody] Product product)
    {
        unitOfWork.Repository<Product>().Add(product);
        if (await unitOfWork.Complete())
            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        return BadRequest("Can't create a product.");
    }

    // PUT api/<ProductsController>/5
    [HttpPut("{id}")]
    public async Task<ActionResult<Product>> UpdateProduct(int id, [FromBody] Product product)
    {
        if (product.Id != id || !ProductExists(id))
            return BadRequest("Cannot update this product.");
        unitOfWork.Repository<Product>().Update(product);

        if (await unitOfWork.Complete())
            return NoContent();

        return BadRequest("Problem updating product.");
    }

    // DELETE api/<ProductsController>/5
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        Product? product = await unitOfWork.Repository<Product>().GetByIdAsync(id);
        if (product is null)
            return NotFound();
        unitOfWork.Repository<Product>().Remove(product);

        if (await unitOfWork.Complete())
            return NoContent();

        return BadRequest("Problem deleting product.");
    }

    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetBrands()
    {
        var spec = new BrandListSpecification();
        return Ok(await unitOfWork.Repository<Product>().GetAllAsync(spec));
    }

    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetTypes()
    {
        var spec = new TypeListSpecification();
        return Ok(await unitOfWork.Repository<Product>().GetAllAsync(spec));
    }

    private bool ProductExists(int id) => unitOfWork.Repository<Product>().Exists(id);
}