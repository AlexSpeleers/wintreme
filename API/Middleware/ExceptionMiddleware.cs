﻿using API.Errors;
using System.Linq.Expressions;
using System.Net;
using System.Text.Json;

namespace API.Middleware;

public class ExceptionMiddleware(IHostEnvironment env, RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await HandleExpetionAsync(context, ex, env);
        }
    }

    private static Task HandleExpetionAsync(HttpContext context, Exception ex, IHostEnvironment env)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
        var response = env.IsDevelopment() ? new ApiErrorResponse(context.Response.StatusCode, ex.Message, ex.StackTrace) : new ApiErrorResponse(context.Response.StatusCode, ex.Message, "Internal server error");

        JsonSerializerOptions options = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        string json = JsonSerializer.Serialize(response, options);
        return context.Response.WriteAsync(json);
    }
}