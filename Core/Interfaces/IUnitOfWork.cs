using Core.Entities;

namespace Core.Interfaces;
public interface IUnitOfWork : IDisposable
{
    public IRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity;
    public Task<bool> Complete();
}