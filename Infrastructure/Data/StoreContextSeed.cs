using Core.Entities;
using System.Reflection;
using System.Text.Json;

namespace Infrastructure.Data;

public class StoreContextSeed
{
    public static async Task SeedAsync(StoreContext context)
    {
        string? path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

        if (!context.Products.Any())
        {
            string productsData = await File.ReadAllTextAsync(path + @"/Data/SeedData/products.json");

            List<Product> products = JsonSerializer.Deserialize<List<Product>>(productsData)!;
            if (products is null) return;

            context.Products.AddRange(products);
            await context.SaveChangesAsync();
        }

        if (!context.DeliveryMethods.Any())
        {
            string dmData = await File.ReadAllTextAsync(path + @"/Data/SeedData/delivery.json");

            List<DeliveryMethod> methods = JsonSerializer.Deserialize<List<DeliveryMethod>>(dmData)!;
            if (methods is null) return;

            context.DeliveryMethods.AddRange(methods);
            await context.SaveChangesAsync();
        }
    }
}