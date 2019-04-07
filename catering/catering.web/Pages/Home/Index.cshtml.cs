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
                .Where(p => p.ReservationStatus != ReservationStatus.Cancelled && p.ReservationStatus != ReservationStatus.Complete)
                .ToListAsync();

            items.ForEach(p =>
            {
                p.DateStart = new DateTime(p.DateStart.Ticks, DateTimeKind.Utc);
                p.DateEnd = new DateTime(p.DateEnd.Ticks, DateTimeKind.Utc);
            });

            return new JsonResult(items);
        }
    }
}