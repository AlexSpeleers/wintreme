using Core.Entities;
using Core.Interfaces;
using System.Collections.Concurrent;

namespace Infrastructure.Data;
public class UnitOfWork(StoreContext context) : IUnitOfWork
{
    private readonly ConcurrentDictionary<string, object> _repositories = new();

    public async Task<bool> Complete() => await context.SaveChangesAsync() > 0;

    public void Dispose() => context.Dispose();

    public IRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
    {
        string type = typeof(TEntity).Name;
        return (IRepository<TEntity>)_repositories.GetOrAdd(type, t =>
        {
            Type repositoryType = typeof(Repository<>).MakeGenericType(typeof(TEntity));
            return Activator.CreateInstance(repositoryType, context)
            ?? throw new InvalidOperationException(
                $"Could not create repository instance for {t}.");
        });
    }
}