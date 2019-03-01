using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using catering.web.Data;
using Microsoft.AspNetCore.Authorization;
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

        public AdministratorController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
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
                Today = items.Where(p=>p.DateStart.Date == now || p.DateEnd.Date == now).ToList(),
                Upcoming = items.Where(p => p.DateStart.Date > now).ToList(),

                 Pending = items.Count(p=>p.ReservationStatus == ReservationStatus.Pending),
                 Paid = items.Count(p=>p.ReservationStatus == ReservationStatus.Paid),
                 Completed = items.Count(p=>p.ReservationStatus == ReservationStatus.Complete),
                 Cancelled = items.Count(p=>p.ReservationStatus == ReservationStatus.Cancelled)

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
}
