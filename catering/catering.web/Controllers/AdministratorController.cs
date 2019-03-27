using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using catering.web.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace catering.web.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = AppRoles.Administrator)]
    public class AdministratorController : Controller
    {
        private readonly AppDbContext _appDbContext;
        private readonly IHostingEnvironment _hostingEnvironment;


        public AdministratorController(AppDbContext appDbContext, IHostingEnvironment hostingEnvironment)
        {
            _appDbContext = appDbContext;
            _hostingEnvironment = hostingEnvironment;
        }

        #region dashboard

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var now = DateTime.UtcNow.Date;
            var start = new DateTime(now.Year, now.Month, 1);
            var end = new DateTime(now.Year, now.Month, DateTime.DaysInMonth(now.Year, now.Month)).AddDays(1).AddMinutes(-1);

            var items = await _appDbContext
                .Reservations
                .Include(p => p.User)
                .Include(p => p.Package)
                .Include(p => p.ReservationItems)
                .Where(p => p.DateStart >= start && p.DateEnd <= end)
                .ToListAsync();

            items.ForEach(p =>
            {
                p.DateStart = new DateTime(p.DateStart.Ticks, DateTimeKind.Utc);
                p.DateEnd = new DateTime(p.DateEnd.Ticks, DateTimeKind.Utc);
            });

            var dashboard = new DashboardInfo
            {
                Reservations = items,
                Today = items.Where(p => p.DateStart.Date == now || p.DateEnd.Date == now).ToList(),
                Upcoming = items.Where(p =>
                    p.DateStart.Date > now
                    && p.DateEnd.Date > now
                    && (p.ReservationStatus == ReservationStatus.Pending
                        || p.ReservationStatus != ReservationStatus.PaymentAccepted
                        || p.ReservationStatus != ReservationStatus.PaymentSent
                        )
                    ).ToList(),
                Overdue = items.Where(p =>
                    p.DateStart.Date < now
                    && p.DateEnd.Date < now
                    && (p.ReservationStatus == ReservationStatus.Pending
                        || p.ReservationStatus != ReservationStatus.PaymentAccepted
                        || p.ReservationStatus != ReservationStatus.PaymentSent
                        )
                    ).ToList(),

                Pending = items.Count(p => p.ReservationStatus == ReservationStatus.Pending),
                Paid = items.Count(p => p.ReservationStatus == ReservationStatus.PaymentAccepted),
                Completed = items.Count(p => p.ReservationStatus == ReservationStatus.Complete),
                Cancelled = items.Count(p => p.ReservationStatus == ReservationStatus.Cancelled)

            };

            return Ok(dashboard);
        }

        #endregion

        #region customers

        [HttpGet("customers")]
        public async Task<IActionResult> GetCustomers()
        {
            var items = await _appDbContext
                .Users
                .Include(p => p.Reservations)
                    .ThenInclude(p => p.Package)
                .Include(p => p.UserRoles)
                .Where(p => p.UserRoles.Any(q => q.RoleId == AppRoles.Customer))
                .ToListAsync();

            return Ok(items);
        }

        #endregion

        #region reservations

        [HttpGet("reservations")]
        public async Task<IActionResult> GetReservations()
        {
            var items = await _appDbContext
                .Reservations
                .Include(p => p.User)
                .Include(p => p.Package)
                .Include(p => p.ReservationItems)
                .ToListAsync();

            return Ok(items);
        }

        [HttpPost("reservations/{id}/accept-payment")]
        public async Task<IActionResult> AcceptPayment(string id)
        {
            var data = await _appDbContext
                .Reservations
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.ReservationId == id);

            if (data == null)
            {
                return NotFound();
            }

            data.ReservationStatus = ReservationStatus.PaymentAccepted;

            var body = $"Your payment with reference # {data.ReferenceNumber} was Accepted by the system.";
            await SendNotification(data.ReservationId, "system", data.User.Mobile, "Reservation Payment Accepted", body);

            await _appDbContext.SaveChangesAsync();

            //  TODO: notify via sms that reservation was completed
            return Ok();
        }

        [HttpPost("reservations/{id}/reject-payment")]
        public async Task<IActionResult> RejectPayment(string id, string reason)
        {
            var data = await _appDbContext
                .Reservations
                .FirstOrDefaultAsync(p => p.ReservationId == id);

            if (data == null)
            {
                return NotFound();
            }

            data.ReservationStatus = ReservationStatus.PaymentRejected;

            var body = $"Your payment with reference # {data.ReferenceNumber} was rejected by the system due to {reason}.";
            await SendNotification(data.ReservationId, "system", data.User.Mobile, "Reservation Payment Rejected", body);
            await _appDbContext.SaveChangesAsync();

            //  TODO: notify via sms that reservation was completed
            return Ok();
        }


        [HttpPost("reservations/{id}/complete")]
        public async Task<IActionResult> SetToComplete(string id)
        {
            var data = await _appDbContext
                .Reservations
                .FirstOrDefaultAsync(p => p.ReservationId == id);

            if (data == null)
            {
                return NotFound();
            }

            data.ReservationStatus = ReservationStatus.Complete;

            await _appDbContext.SaveChangesAsync();

            var body = $"Your reservation was set to completed by the system.";
            await SendNotification(data.ReservationId, "system", data.User.Mobile, "Reservation Completed", body);

            return Ok();
        }

        [HttpPost("reservations/{id}/cancel")]
        public async Task<IActionResult> SetToCancel(string id, string reason)
        {
            var data = await _appDbContext
                .Reservations
                .FirstOrDefaultAsync(p => p.ReservationId == id);

            if (data == null)
            {
                return NotFound();
            }

            data.ReservationStatus = ReservationStatus.Cancelled;
            var body = $"Your reservation was cancelled by the system due to {reason}.";
            await SendNotification(data.ReservationId, "system", data.User.Mobile, "Reservation Cancelled", body);
            await _appDbContext.SaveChangesAsync();

            //  TODO: notify via sms that reservation was cancelled
            return Ok();
        }
        #endregion

        #region packages

        [HttpGet("packages")]
        public async Task<IActionResult> GetPackages()
        {
            var items = await _appDbContext
                .Packages
                .Include(p => p.Items)
                .Include(p => p.Images)
                .ToListAsync();

            return Ok(items);
        }

        [HttpPost("packages/itemAdd")]
        public async Task<IActionResult> AddPackageItem([FromBody]AddPackageImageInfo info)
        {
            var package = await _appDbContext
                .Packages
                .FirstOrDefaultAsync(p => p.PackageId == info.PackageId);

            if (package == null)
            {
                return NotFound();
            }

            var packageImageId = Guid.NewGuid().ToString();

            var image = new PackageImage
            {
                PackageImageId = packageImageId,
                PackageId = info.PackageId,
                Name = info.Name,
                Description = info.Description,
                ImageUrl = ""
            };

            await _appDbContext.AddAsync(image);

            await _appDbContext.SaveChangesAsync();

            return Created(image.PackageImageId, image);
        }

        [HttpPost("packages/itemEdit")]
        public async Task<IActionResult> EditPackageItem([FromBody]EditPackageImageInfo info)
        {
            var data = await _appDbContext
                .PackageImages
                .FirstOrDefaultAsync(p => p.PackageImageId == info.PackageImageId);

            if (data == null)
            {
                return NotFound();
            }

            data.Name = info.Name;
            data.Description = info.Description;

            var packageImageId = Guid.NewGuid().ToString();

            _appDbContext.Update(data);

            await _appDbContext.SaveChangesAsync();

            return Created(data.PackageImageId, data);
        }

        [HttpPost("packages/item/{id}/image")]
        public async Task<IActionResult> UploadImage(string id)
        {
            var image = await _appDbContext
                .PackageImages
                .FirstOrDefaultAsync(p => p.PackageImageId == id);

            if (image == null)
            {
                return NotFound();
            }
            var path = _hostingEnvironment.WebRootPath + "/images";

            //  delete existing
            var oldFileName = Path.Combine(_hostingEnvironment.WebRootPath, image.ImageUrl);

            if (System.IO.File.Exists(oldFileName))
            {
                System.IO.File.Delete(oldFileName);
            }

            var file = HttpContext.Request.Form.Files[0];
            var stream = file.OpenReadStream();
            var name = $"{image.PackageImageId}-{file.FileName}";



            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }


            var fileName = Path.Combine(path, name);

            using (var fs = new FileStream(fileName, FileMode.Create))
            {
                await file.CopyToAsync(fs);
            }

            image.ImageUrl = $"images/{name}";

            _appDbContext.Update(image);

            await _appDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("packages/item/{id}/remove")]
        public async Task<IActionResult> DeletePackageItem(string id)
        {
            var image = await _appDbContext
                .PackageImages
                .FirstOrDefaultAsync(p => p.PackageImageId == id);

            if (image == null)
            {
                return NotFound();
            }

            //  delete existing image
            var oldFileName = Path.Combine(_hostingEnvironment.WebRootPath, image.ImageUrl);

            if (System.IO.File.Exists(oldFileName))
            {
                System.IO.File.Delete(oldFileName);
            }

            _appDbContext.Remove(image);

            await _appDbContext.SaveChangesAsync();

            return Ok();
        }

        #endregion


        string GetUserId()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            return userId;
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

    public class DashboardInfo
    {
        public List<Reservation> Reservations { get; set; }
        public List<Reservation> Today { get; set; }
        public List<Reservation> Upcoming { get; set; }
        public List<Reservation> Overdue { get; set; }


        public int Pending { get; set; }
        public int Paid { get; set; }
        public int Completed { get; set; }
        public int Cancelled { get; set; }
    }

    public class AddPackageImageInfo
    {
        public string PackageId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }

    public class EditPackageImageInfo : AddPackageImageInfo
    {
        public string PackageImageId { get; set; }
    }
}
