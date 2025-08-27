using Core.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Core.Interfaces;

public class ProductRepository(StoreContext storeContext) : IProductRepository
{
    public void AddProduct(Product product) => storeContext.Products.Add(product);

    public void DeleteProduct(Product product) => storeContext.Products.Remove(product);

    public async Task<IReadOnlyList<Product>> GetProductsAsync(string? brand, string? type, string? sort)
    {
        IQueryable<Product> query = storeContext.Products.AsQueryable();
        if (!string.IsNullOrWhiteSpace(brand))
            query = query.Where(x => x.Brand == brand);
        if (!string.IsNullOrEmpty(type))
            query = query.Where(x => x.Type == type);

        query = sort switch
        {
            "priceAsc" => query.OrderBy(x => x.Price),
            "priceDesc" => query.OrderByDescending(x => x.Price),
            _ => query.OrderBy(x => x.Name)
        };
        return await query.ToListAsync();
    }

    public async Task<Product> GetProductByIdAsync(int id) => await storeContext.Products.FindAsync(id);

    public async Task<IReadOnlyList<string>> GetBrandAsync() => await storeContext.Products.Select(p => p.Brand).Distinct().ToListAsync();
    public async Task<IReadOnlyList<string>> GetTypesAsync() => await storeContext.Products.Select(p => p.Type).Distinct().ToListAsync();

    public bool ProductExists(int id) => storeContext.Products.Any(p => p.Id == id);

    public async Task<bool> SaveChangesAsync() => await storeContext.SaveChangesAsync() > 0;

    public void UpdateProduct(Product product) => storeContext.Entry(product).State = EntityState.Modified;
}