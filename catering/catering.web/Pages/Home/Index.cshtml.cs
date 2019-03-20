using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using catering.web.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace catering.web.Pages.Home
{
    public class IndexModel : PageModel
    {
        private readonly AppDbContext _appDbContext;

        public IndexModel(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [BindProperty]
        public List<PackageImage> Images { get; set; }

        public async Task OnGet()
        {
            Images = await _appDbContext.PackageImages.ToListAsync();
        }

        public async Task<JsonResult> OnGetReservationsAsync()
        {
            var items = await _appDbContext
                .Reservations
                .Include(p => p.Package)
                .ToListAsync();

            items.ForEach(p =>
            {
                var s1 = p.DateStart;
                var e1 = p.DateEnd;

                var s = new DateTime(s1.Year, s1.Month, s1.Day, s1.Hour, s1.Minute, 0, DateTimeKind.Utc);
                var e = new DateTime(e1.Year, e1.Month, e1.Day, e1.Hour, e1.Minute, 0, DateTimeKind.Utc);

                p.DateStart = s;
                p.DateEnd = e;
            });

            return new JsonResult(items);
        }
    }
}