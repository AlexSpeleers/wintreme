using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class Repository<T>(StoreContext _storeContext) : IRepository<T> where T : BaseEntity
{
    public async Task<T?> GetByIdAsync(int id) => await _storeContext.Set<T>().FindAsync(id);
    public async Task<IReadOnlyList<T>> GetAllAsync() => await _storeContext.Set<T>().ToListAsync();
    public async Task<IReadOnlyList<T>> GetAllAsync(ISpecification<T> spec) => await ApplySpecification(spec).ToListAsync();
    public async Task<T?> GetEntityWithSpec(ISpecification<T> spec) => await ApplySpecification(spec).FirstOrDefaultAsync();
    public async Task<bool> SaveAllAsync() => await _storeContext.SaveChangesAsync() > 0;
    
    public void Add(T entity) => _storeContext.Set<T>().Add(entity);
    public void Remove(T entity) => _storeContext.Set<T>().Remove(entity);
    public bool Exists(int id) => _storeContext.Set<T>().Any(entity => entity.Id == id);
    public void Update(T entity)
    {
        _storeContext.Set<T>().Attach(entity);
        _storeContext.Entry(entity).State = EntityState.Modified;
    }

    public async Task<int> CountAsync(ISpecification<T> spec)
    {
        IQueryable<T> query = _storeContext.Set<T>().AsQueryable();
        query = spec.ApplyCriteria(query);
        return await query.CountAsync();
    }

    public async Task<TResult?> GetEntityWithSpec<TResult>(ISpecification<T, TResult> spec) => await ApplySpecification(spec).FirstOrDefaultAsync();

    public async Task<IReadOnlyList<TResult>> GetAllAsync<TResult>(ISpecification<T, TResult> spec) => await ApplySpecification(spec).ToListAsync();


    private IQueryable<T> ApplySpecification(ISpecification<T> spec) => SpecificationEvaluator<T>.GetQuery(_storeContext.Set<T>().AsQueryable(), spec);
    
    private IQueryable<TResult> ApplySpecification<TResult>(ISpecification<T, TResult> spec) => SpecificationEvaluator<T>.GetQuery<T, TResult>(_storeContext.Set<T>().AsQueryable(), spec);
}