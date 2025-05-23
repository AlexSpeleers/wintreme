using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BaseApiController : ControllerBase
{
    protected async Task<ActionResult> CreatePagedResult<T>(IRepository<T> repo, ISpecification<T> spec, int pageIndex, int pageSize) where T : BaseEntity
    {
        IReadOnlyList<T> items = await repo.GetAllAsync(spec);
        int cout = await repo.CountAsync(spec);
        
        Pagination<T> pagination = new(pageIndex, pageSize, cout, items);
        
        return Ok(pagination);
    }
}