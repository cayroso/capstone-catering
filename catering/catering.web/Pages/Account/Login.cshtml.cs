using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using catering.web.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace catering.web.Pages.Account
{
    public class LoginModel : PageModel
    {
        private readonly AppDbContext _appDbContext;

        public LoginModel(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public class InputModel
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; }
            [Required]
            [DataType(DataType.Password)]
            public string Password { get; set; }
        }

        [BindProperty]
        public InputModel Input { get; set; }

        public string ReturnUrl { get; set; }
        [TempData]
        public string ErrorMessage { get; set; }



        public async Task OnGetAsync(string returnUrl = null)
        {
            if (!string.IsNullOrWhiteSpace(ErrorMessage))
            {
                ModelState.AddModelError(string.Empty, ErrorMessage);
            }

            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            ReturnUrl = returnUrl;
        }

        public async Task<IActionResult> OnPostAsync(string returnUrl = null)
        {
            if (ModelState.IsValid)
            {
                if (!string.IsNullOrWhiteSpace(returnUrl))
                {
                    ReturnUrl = returnUrl;
                }

                var user = await GetUserAsync(Input.Email, Input.Password);

                if (user == null)
                {
                    ModelState.AddModelError(string.Empty, "Invalid Login Attemp");
                    return Page();
                }

                #region Login

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserId),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.UserName),
                };

                if (user.UserRoles.Any())
                {
                    user.UserRoles.ToList().ForEach(p =>
                    {
                        claims.Add(new Claim(ClaimTypes.Role, p.Role.RoleId));
                    });
                }

                var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                var principal = new ClaimsPrincipal(identity);

                await HttpContext.SignInAsync(principal);


                #endregion

                if (!Url.IsLocalUrl(ReturnUrl))
                {
                    return LocalRedirect(Url.Page("/Home/Index"));
                }
                return LocalRedirect(Url.Page(ReturnUrl));

                //return LocalRedirect(Url.GetLocalUrl(returnUrl));
            }


            return Page();
        }


        private async Task<User> GetUserAsync(string email, string password)
        {
            var data = await _appDbContext
                    .Users
                    .Include(p => p.UserRoles)
                        .ThenInclude(p => p.Role)
                    .FirstOrDefaultAsync(p => p.Email == email && p.Password == password);

            return data;
        }
    }


}