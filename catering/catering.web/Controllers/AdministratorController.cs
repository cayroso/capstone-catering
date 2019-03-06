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
            var end = new DateTime(now.Year, now.Month, DateTime.DaysInMonth(now.Year, now.Month));

            var items = await _appDbContext
                .Reservations
                .Include(p => p.User)
                .Include(p => p.Package)
                .Include(p => p.PackageItems)
                .Where(p => p.DateStart >= start && p.DateEnd <= end)
                .ToListAsync();

            var dashboard = new DashboardInfo
            {
                Reservations = items,
                Today = items.Where(p => p.DateStart.Date == now || p.DateEnd.Date == now).ToList(),
                Upcoming = items.Where(p => p.DateStart.Date > now).ToList(),

                Pending = items.Count(p => p.ReservationStatus == ReservationStatus.Pending),
                Paid = items.Count(p => p.ReservationStatus == ReservationStatus.Paid),
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
                .Include(p => p.PackageItems)
                .ToListAsync();

            return Ok(items);
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

            //  TODO: notify via sms that reservation was completed
            return Ok();
        }

        [HttpPost("reservations/{id}/cancel")]
        public async Task<IActionResult> SetToCancel(string id)
        {
            var data = await _appDbContext
                .Reservations
                .FirstOrDefaultAsync(p => p.ReservationId == id);

            if (data == null)
            {
                return NotFound();
            }

            data.ReservationStatus = ReservationStatus.Cancelled;

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
                .ToListAsync();

            return Ok(items);
        }

        [HttpPost("packages/item")]
        public async Task<IActionResult> AddPackageItem([FromBody]AddPackageItemInfo info)
        {
            var package = await _appDbContext
                .Packages
                .FirstOrDefaultAsync(p => p.PackageId == info.PackageId);

            if (package == null)
            {
                return NotFound();
            }

            var packageItemId = Guid.NewGuid().ToString();

            var packageItem = new PackageItem
            {
                PackageItemId = packageItemId,
                PackageId = info.PackageId,
                Name = info.Name,
                Description = info.Description,
                ImageUrl = ""
            };

            await _appDbContext.AddAsync(packageItem);

            await _appDbContext.SaveChangesAsync();

            return Created(packageItem.PackageItemId, packageItem);
        }

        [HttpPost("packages/item/{id}/image")]
        public async Task<IActionResult> UploadImage(string id)
        {
            var packageItem = await _appDbContext
                .PackageItems
                .FirstOrDefaultAsync(p => p.PackageItemId == id);

            if (packageItem == null)
            {
                return NotFound();
            }
            var path = _hostingEnvironment.WebRootPath + "/images";

            //  delete existing
            var oldFileName = Path.Combine(_hostingEnvironment.WebRootPath, packageItem.ImageUrl);

            if (System.IO.File.Exists(oldFileName))
            {
                System.IO.File.Delete(oldFileName);
            }

            var file = HttpContext.Request.Form.Files[0];
            var stream = file.OpenReadStream();
            var name = $"{packageItem.PackageItemId}-{file.FileName}";



            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }


            var fileName = Path.Combine(path, name);

            using (var fs = new FileStream(fileName, FileMode.Create))
            {
                await file.CopyToAsync(fs);
            }

            packageItem.ImageUrl = $"images/{name}";

            await _appDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("packages/item/{id}/remove")]
        public async Task<IActionResult> DeletePackageItem(string id)
        {
            var item = await _appDbContext
                .PackageItems
                .FirstOrDefaultAsync(p => p.PackageItemId == id);

            if(item == null)
            {
                return NotFound();
            }

            //  delete existing image
            var oldFileName = Path.Combine(_hostingEnvironment.WebRootPath, item.ImageUrl);

            if (System.IO.File.Exists(oldFileName))
            {
                System.IO.File.Delete(oldFileName);
            }

            _appDbContext.Remove(item);

            await _appDbContext.SaveChangesAsync();

            return Ok();
        }

        #endregion

        string GetUserId()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            return userId;
        }
    }

    public class DashboardInfo
    {
        public List<Reservation> Reservations { get; set; }
        public List<Reservation> Today { get; set; }
        public List<Reservation> Upcoming { get; set; }


        public int Pending { get; set; }
        public int Paid { get; set; }
        public int Completed { get; set; }
        public int Cancelled { get; set; }
    }

    public class AddPackageItemInfo
    {
        public string PackageId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
