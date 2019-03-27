using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using catering.web.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace catering.web.Pages.Account
{
    public class RegisterModel : PageModel
    {
        private readonly AppDbContext _appDbContext;

        public RegisterModel(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public class InputModel
        {
            [Required]
            public string Username { get; set; }
            [Required]
            [DataType(DataType.Password)]
            public string Password { get; set; }
            [Required]
            [DataType(DataType.Password)]
            public string ConfirmPassword { get; set; }

            [Required]
            public string FullName { get; set; }
            [Required]
            [DataType(DataType.EmailAddress)]
            public string Email { get; set; }
            public string Address { get; set; }
            [Required]            
            public string Mobile { get; set; }            
        }

        [BindProperty]
        public InputModel Input { get; set; }

        public void OnGet(string returnUrl = null)
        {
           
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (ModelState.IsValid)
            {
                if(Input.Password != Input.ConfirmPassword)
                {
                    ModelState.AddModelError(string.Empty, "Please confirm your password");
                    return Page();
                }

                var sameUsername = await _appDbContext
                    .Users
                    .FirstOrDefaultAsync(p => p.UserName == Input.Username);

                if (sameUsername != null)
                {
                    ModelState.AddModelError(string.Empty, "Username not available");
                    return Page();
                }
                
                var sameEmail = await _appDbContext
                    .Users
                    .FirstOrDefaultAsync(p => p.Email == Input.Email);

                if (sameEmail != null)
                {
                    ModelState.AddModelError(string.Empty, "Email not available");
                    return Page();
                }

                var user = new User
                {
                    UserId = Guid.NewGuid().ToString(),
                    UserName = Input.Username,
                    Password = Input.Password,
                    FullName = Input.FullName,
                    Email = Input.Email,
                    Address = Input.Address,
                    Mobile = Input.Mobile,
                };

                var userRole = new UserRole
                {
                    UserRoleId = Guid.NewGuid().ToString(),
                    UserId = user.UserId,
                    RoleId = AppRoles.Customer
                };

                await _appDbContext.AddAsync(user);
                await _appDbContext.AddAsync(userRole);

                await _appDbContext.SaveChangesAsync();

                return LocalRedirect("~/Account/Login");
            }

            return Page();
        }
        
    }
}