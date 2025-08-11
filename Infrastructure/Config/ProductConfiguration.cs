using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Config;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.Property<decimal>(nameof(Product.Price)).HasColumnType("decimal(18,2)");
        builder.Property<string>(nameof(Product.Name)).IsRequired();
    }
}