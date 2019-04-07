using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using catering.web.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace catering.web.Pages.Account
{
    public class ForgotPasswordModel : PageModel
    {
        private readonly AppDbContext _appDbContext;

        public ForgotPasswordModel(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        
        [BindProperty]
        public string Email { get; set; }
        [BindProperty]
        public string Message { get; set; }
        [BindProperty]
        public string Error { get; set; }
        public void OnGet()
        {

        }

        public async Task OnPostAsync()
        {
            var data = await _appDbContext
                .Users
                .FirstOrDefaultAsync(p=> p.Email == Email);

            if (data == null) {
                Error = "Email is invalid";

                return;
            }
            var rnd = new Random(DateTimeOffset.UtcNow.Hour).Next(1, 100000);

            var password = rnd.ToString("000000");

            data.Password = password;

            var sms = new ShortMessage
            {
                ShortMessageId = Guid.NewGuid().ToString(),
                ReservationId = null,
                Sender = "system",
                Receiver = data.Mobile,
                Subject = "Your New Password for EC Catering Service",
                Body = $"Use this new password {password} when accessing the application",
            };

            await _appDbContext.AddAsync(sms);

            await _appDbContext.SaveChangesAsync();

            Message = "Password will be send via sms.";

        }
    }
}