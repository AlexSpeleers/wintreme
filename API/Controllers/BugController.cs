﻿using API.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
public class BugController : BaseApiController
{
    [HttpGet("unauthorized")]
    public IActionResult GetUnauthorized()
    {
        return Unauthorized();
    }

    [HttpGet("badrequest")]
    public IActionResult GetBadRequest()
    {
        return BadRequest();
    }

    [HttpGet("notfound")]
    public IActionResult GetNotFound()
    {
        return NotFound();
    }

    [HttpGet("internalerror")]
    public IActionResult GetInternalError()
    {
        throw new Exception("test exception");
    }

    [HttpPost("validationerror")]
    public IActionResult GetValidationError(CreateProductDto createProductDto)
    {
        return Ok();
    }
}