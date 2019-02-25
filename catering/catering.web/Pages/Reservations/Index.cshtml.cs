using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using catering.web.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace catering.web.Pages.Reservations
{
    public class IndexModel : PageModel
    {
        private readonly AppDbContext _appDbContext;

        public IndexModel(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task OnGetAsync()
        {
            var packages = await _appDbContext
                .Packages
                .ToListAsync();

            Packages = packages;
        }

        [BindProperty]
        public List<Package> Packages { get; set; }

        public async Task<JsonResult> OnGetPackagesAsync()
        {
            var packages = await _appDbContext
                .Packages
                .ToListAsync();

            var result = new JsonResult(packages);

            return result;
        }

        public async Task<JsonResult> OnGetPricingAsync()
        {
            var items = await _appDbContext.ItemPrices
                .OrderByDescending(p => p.DateCreated)
                .FirstOrDefaultAsync();

            var result = new JsonResult(items);

            return result;
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
                var s = new DateTime(s1.Year, s1.Month, s1.Day, s1.Hour, s1.Minute, s1.Second, DateTimeKind.Utc);

                var e1 = p.DateEnd;
                var e = new DateTime(e1.Year, e1.Month, e1.Day, e1.Hour, e1.Minute, e1.Second, DateTimeKind.Utc);

                p.DateStart = s;
                p.DateEnd = e;

            });

            return new JsonResult(items);
        }

        public async Task<IActionResult> OnPostReservationAsync([FromBody]ReservationInfo info)
        {
            if (info.DateStart > info.DateEnd)
            {
                return BadRequest(new { message = "Date Start cannot exceed Date End." });
            }

            if (info.DateStart == info.DateEnd)
            {
                info.DateEnd = info.DateEnd.AddMinutes(59);
            }
            else
            {
                info.DateEnd = info.DateEnd.AddSeconds(-1);
            }

            var conflicts = _appDbContext.Reservations
                            .Where(p =>
                                p.ReservationStatus != ReservationStatus.Abandoned
                                &&
                                ((info.DateStart > p.DateStart && info.DateStart < p.DateEnd) ||
                                (info.DateEnd > p.DateStart && info.DateEnd < p.DateEnd))
                                )
                            .ToList();

            if (conflicts.Any())
            {
                var message = "Please Select another start or end date. Your reservation will conflict with existing ones.";

                return BadRequest(new { message, conflicts });
            }

            var user = _appDbContext.Users.First(p => p.Email == User.Identity.Name);
            var package = _appDbContext.Packages.SingleOrDefault(p => p.PackageId == info.PackageId);

            var reservationId = Guid.NewGuid().ToString();
            var reservation = new Reservation
            {
                ReservationId = reservationId,
                UserId = user.UserId,
                PackageId = info.PackageId,

                GuestCount = info.GuestCount,

                PlateCount = info.PlateCount,
                PlatePrice = info.PlatePrice,
                SpoonCount = info.SpoonCount,
                SpoonPrice = info.SpoonPrice,
                ForkCount = info.ForkCount,
                ForkPrice = info.ForkPrice,
                GlassCount = info.GlassCount,
                GlassPrice = info.GlassPrice,
                ChairCount = info.ChairCount,
                ChairPrice = info.ChairPrice,
                TableCount = info.TableCount,
                TablePrice = info.TablePrice,
                HasFlowers = info.HasFlower,
                FlowerPrice = info.FlowerPrice,
                HasSoundSystem = info.HasSoundSystem,
                SoundSystemPrice = info.SoundSystemPrice,

                AmountPaid = 0,
                ReferenceNumber = string.Empty,

                DateStart = info.DateStart,
                DateEnd = info.DateEnd,
                ReservationStatus = ReservationStatus.Pending
            };

            _appDbContext.Add(reservation);

            _appDbContext.Add(new ReservationNote
            {
                Content = "Reservation started",
                UserId = user.UserId,
                ReservationId = reservationId
            });

            await _appDbContext.SaveChangesAsync();

            return new OkResult();
        }
        

    }



    public class ReservationInfo
    {
        public string PackageId { get; set; }

        public int GuestCount { get; set; }

        public int PlateCount { get; set; }
        public int SpoonCount { get; set; }
        public int ForkCount { get; set; }
        public int GlassCount { get; set; }
        public int ChairCount { get; set; }
        public int TableCount { get; set; }
        public bool HasSoundSystem { get; set; }
        public bool HasFlower { get; set; }

        public decimal PlatePrice { get; set; }
        public decimal SpoonPrice { get; set; }
        public decimal ForkPrice { get; set; }
        public decimal GlassPrice { get; set; }
        public decimal ChairPrice { get; set; }
        public decimal TablePrice { get; set; }
        public decimal SoundSystemPrice { get; set; }
        public decimal FlowerPrice { get; set; }

        public DateTime DateStart { get; set; }
        public DateTime DateEnd { get; set; }
    }



}