using Core.Entities;

namespace Core.Interfaces;
public interface IRepository<T> where T : BaseEntity
{
    public Task<T?> GetByIdAsync(int id);
    public Task<IReadOnlyList<T>> GetAllAsync();
    public Task<T?> GetEntityWithSpec(ISpecification<T> spec);
    public Task<IReadOnlyList<T>> GetAllAsync(ISpecification<T> spec);
    public Task<TResult?> GetEntityWithSpec<TResult>(ISpecification<T, TResult> spec);
    public Task<IReadOnlyList<TResult>> GetAllAsync<TResult>(ISpecification<T, TResult> spec);
    public Task<bool> SaveAllAsync();
    public void Add(T entity);
    public void Update(T entity);
    public void Remove(T entity);
    public bool Exists(int id);
}
