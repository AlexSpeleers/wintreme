using Core.Interfaces;
using System.Linq.Expressions;

namespace Core.Specifications;

public class BaseSpecification<T>(Expression<Func<T, bool>>? _criteria) : ISpecification<T>
{
    protected BaseSpecification() : this(null) { }
    public Expression<Func<T, bool>>? Criteria => _criteria;

    public Expression<Func<T, object>>? OrderBy { get; private set; }

    public Expression<Func<T, object>>? OrderByDescending { get; private set; }

    public bool IsDistinct { get; private set; }

    protected void AddOrderBy(Expression<Func<T, object>> orderBy) => OrderBy = orderBy;
    protected void AddOrderByDescending(Expression<Func<T, object>> orderByDescending) => OrderByDescending = orderByDescending;

    protected void ApplyDistinct() => IsDistinct = true;
}

public class BaseSpecification<T, TResult>(Expression<Func<T, bool>> _criteria) : BaseSpecification<T>(_criteria), ISpecification<T, TResult>
{
    protected BaseSpecification() : this(null!) { }
    public Expression<Func<T, TResult>>? Select { get; private set; }

    protected void AddSelect(Expression<Func<T, TResult>> select)
    {
        Select = select;
    }
}