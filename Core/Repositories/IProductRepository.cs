using Core.Entities;

namespace Core.Repositories;
public interface IProductRepository
{
    public Task<IReadOnlyList<Product>> GetProductsAsync(string? brand, string? type, string? sort);
    public Task<Product> GetProductByIdAsync(int id);
    public Task<IReadOnlyList<string>>GetBrandAsync(); 
    public Task<IReadOnlyList<string>>GetTypesAsync(); 
    public void AddProduct(Product product);
    public void UpdateProduct(Product product);
    public void DeleteProduct(Product product);
    public bool ProductExists(int id);
    public Task<bool> SaveChangesAsync();
}
