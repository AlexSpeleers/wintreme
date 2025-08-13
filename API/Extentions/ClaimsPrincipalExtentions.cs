using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Authentication;
using System.Security.Claims;

namespace API.Extentions;

public static class ClaimsPrincipalExtentions
{
    public static async Task<AppUser> GetUserByEmail(this UserManager<AppUser> userManager, ClaimsPrincipal user)
    {
        AppUser? response = await userManager.Users.FirstOrDefaultAsync(x => x.Email == user.GetEmail());
        if (response == null)
            throw new AuthenticationException("User not found.");
        return response;
    }
    public static async Task<AppUser> GetUserByEmailWithAddress(this UserManager<AppUser> userManager, ClaimsPrincipal user)
    {
        AppUser? response = await userManager.Users
            .Include(x => x.Address)
            .FirstOrDefaultAsync(x => x.Email == user.GetEmail());
        if (response == null)
            throw new AuthenticationException("User not found.");
        return response;
    }

    public static string GetEmail(this ClaimsPrincipal user)
    {
        string email = user.FindFirstValue(ClaimTypes.Email)
        ?? throw new AuthenticationException("Email claim not found.");
        return email;
    }
}