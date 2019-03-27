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
                .Include(p => p.Images)
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
                p.DateStart = new DateTime(p.DateStart.Ticks, DateTimeKind.Utc);
                p.DateEnd = new DateTime(p.DateEnd.Ticks, DateTimeKind.Utc);
            });

            return new JsonResult(items);
        }

        public async Task<IActionResult> OnPostReservationAsync([FromBody]ReservationInfo info)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return BadRequest(new { message = "Register or SignIn before booking a catering service." });
            }

            var dateStart = DateTimeOffset.FromUnixTimeMilliseconds(info.DateStartTicks);
            var dateEnd = DateTimeOffset.FromUnixTimeMilliseconds(info.DateEndTicks);

            if (dateStart > dateEnd)
            {
                return BadRequest(new { message = "Date Start cannot exceed Date End." });
            }

            var now = DateTimeOffset.UtcNow;

            if (dateStart <= now || dateEnd <= now)
            {
                return BadRequest(new { message = "Cannot reserve today or to past dates" });
            }

            if (dateStart == dateEnd)
            {
                dateEnd = dateEnd.AddMinutes(59);
            }
            else
            {
               dateEnd = dateEnd.AddSeconds(-1);
            }

            //var startUtc = dateStart.UtcDateTime;
            //var endUtc = dateEnd.UtcDateTime;

            var conflicts = _appDbContext.Reservations
                            .Where(p =>
                                p.ReservationStatus != ReservationStatus.Cancelled
                                &&
                                ((dateStart >= p.DateStart && dateStart <= p.DateEnd) ||
                                (dateEnd >= p.DateStart && dateEnd <= p.DateEnd))
                                )
                            .ToList();

            if (conflicts.Count >= 3)
            {
                var message = "Please Select another start or end date. Your reservation will conflict with existing ones.";

                return BadRequest(new { message, conflicts });
            }

            var user = _appDbContext.Users.First(p => p.UserName == User.Identity.Name);
            var package = _appDbContext.Packages.SingleOrDefault(p => p.PackageId == info.PackageId);

            var reservationId = Guid.NewGuid().ToString();
            var reservation = new Reservation
            {
                ReservationId = reservationId,
                UserId = user.UserId,
                PackageId = info.PackageId,
                Title = info.Title,
                Venue = info.Venue,
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
                FixedCost = info.FixedCost,
                FixedLabor = info.FixedLabor,
                AmountPaid = 0,
                ReferenceNumber = string.Empty,

                DateStart = dateStart,
                DateEnd = dateEnd,
                ReservationStatus = ReservationStatus.Pending
            };

            _appDbContext.Add(reservation);

            _appDbContext.Add(new ReservationNote
            {
                ReservationNoteId = Guid.NewGuid().ToString(),
                ReservationId = reservation.ReservationId,
                Content = info.Notes,
                DateCreated = DateTime.UtcNow,
                UserId = user.UserId
            });

            info.PackageImageIds.ForEach(async p =>
            {
                var packageImage = await _appDbContext
                    .PackageImages
                    .FirstOrDefaultAsync(q => q.PackageImageId == p);

                if (packageImage != null)
                {
                    var reservationItem = new ReservationItem
                    {
                        ReservationItemId = Guid.NewGuid().ToString(),
                        ReservationId = reservation.ReservationId,
                        ImageUrl = packageImage.ImageUrl,
                        Name = packageImage.Name,
                        Description = packageImage.Description
                    };

                    await _appDbContext.AddAsync(reservationItem);
                }
            });

            var admin = await _appDbContext.Users.FirstAsync(p => p.UserId == "administrator");

            //  notification for the administrator
            var body1 = $"A new reservation was booked by customer {user.FullName}";
            await SendNotification(reservation.ReservationId, "system", admin.Mobile, "New Reservation Request", body1);

            var body2 = $"Your reservation request was accepted by the system. If you have not yet set the payment options for this reservation, please proceed with the payment so that the system can complete your reservation.";
            await SendNotification(reservation.ReservationId, "system", user.Mobile, "Your Reservation Request Accepted", body2);


            await _appDbContext.SaveChangesAsync();


            return new OkResult();
        }

        async Task SendNotification(string reservationid, string sender, string receiver, string subject, string body)
        {
            var sms = new ShortMessage
            {
                ShortMessageId = Guid.NewGuid().ToString(),
                ReservationId = reservationid,
                Sender = sender,
                Receiver = receiver,
                Subject = subject,
                Body = body,
            };

            await _appDbContext.AddAsync(sms);
        }
    }



    public class ReservationInfo
    {
        public string PackageId { get; set; }

        public int GuestCount { get; set; }

        public string Title { get; set; }
        public string Venue { get; set; }

        
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

        public decimal FixedCost { get; set; }
        public decimal FixedLabor { get; set; }

        public long DateStartTicks { get; set; }
        public long DateEndTicks { get; set; }

        public List<string> PackageImageIds { get; set; }

        public string Notes { get; set; }
    }



}