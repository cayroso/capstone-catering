using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using catering.web.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace catering.web.Pages.Account
{
    [Authorize]
    public class ChangePasswordModel : PageModel
    {

        private readonly AppDbContext _appDbContext;

        public ChangePasswordModel(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [BindProperty]
        public string CurrentPassword { get; set; }
        [BindProperty]
        public string NewPassword { get; set; }
        [BindProperty]
        public string ConfirmPassword { get; set; }

        [BindProperty]
        public string Error { get; set; }
        public void OnGet()
        {
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if(CurrentPassword == NewPassword)
            {
                Error = "Current password is the same with the new password";
                return Page();
            }

            if(NewPassword != ConfirmPassword)
            {
                Error = "Please confirm your password";
                return Page();
            }

            var data = await _appDbContext
                .Users
                .FirstOrDefaultAsync(p => p.UserId == User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if (data == null)
            {
                return NotFound();
            }

            if(data.Password != CurrentPassword)
            {
                Error = "Please confirm your current password";
                return Page();
            }

            data.Password = NewPassword;

            await _appDbContext.SaveChangesAsync();

            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            return LocalRedirectPermanent("~/");
        }
    }
}