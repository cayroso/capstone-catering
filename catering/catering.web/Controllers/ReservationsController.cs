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
    [Authorize]
    public class ReservationsController : Controller
    {
        private readonly AppDbContext _appDbContext;

        public ReservationsController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpGet("availability")]
        //public async Task<IActionResult> CheckAvailability(long startTicks, long endTicks)
        public async Task<IActionResult> CheckAvailability(long startTicks, long endTicks)
        {
            var start = DateTimeOffset.FromUnixTimeMilliseconds(startTicks);
            var end = DateTimeOffset.FromUnixTimeMilliseconds(endTicks);

            if (start > end)
            {
                return BadRequest("Please check your dates");
            }

            var s = DateTimeOffset.UtcNow.Date;
            var e = s.AddDays(1).AddSeconds(-1);

            if (start >= s && start <= e || (end >= s && end <= e))
            {
                return BadRequest("Cannot Reserve today");
            }

            var startUtc = start.UtcDateTime;
            var endUtc = end.UtcDateTime;

            var found = await _appDbContext
                .Reservations
                .Where(p => (startUtc >= p.DateStart && startUtc <= p.DateEnd) || (endUtc >= p.DateStart && endUtc <= p.DateEnd))
                .ToListAsync();

            if (found.Count >= 3)
            {
                return BadRequest("Dates are already reserved");
            }

            return Ok();
        }

        [HttpPost("addNote/{id}")]
        public async Task<IActionResult> AddNote(string id, string note)
        {
            var reservation = await _appDbContext
                .Reservations
                .FirstOrDefaultAsync(p => p.UserId == GetUserId() && p.ReservationId == id);

            if (reservation == null)
            {
                return NotFound();
            }

            var notes = new ReservationNote
            {
                ReservationNoteId = Guid.NewGuid().ToString(),
                ReservationId = id,
                Content = note,
                DateCreated = DateTime.UtcNow,
                UserId = GetUserId(),
            };

            await _appDbContext.ReservationNotes
                .AddAsync(notes);

            await _appDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("completeReservation/{id}")]
        public async Task<IActionResult> CompleteReservation(string id)
        {
            //  check if administrator
            if (!User.IsInRole(AppRoles.Administrator))
            {
                return BadRequest("You are not allowed to complete the reservation.");
            }

            var reservation = await _appDbContext
                .Reservations
                .Include(p => p.Notes)
                .FirstOrDefaultAsync(p => p.UserId == GetUserId() && p.ReservationId == id);


            if (reservation == null)
            {
                return NotFound();
            }

            reservation.ReservationStatus = ReservationStatus.Complete;

            await _appDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("pricing")]
        public async Task<IActionResult> GetItemPrice()
        {
            var data = await _appDbContext
                .ItemPrices                
                .FirstAsync();

            return Ok(data);
        }

        [HttpPost("pricing")]
        public async Task<IActionResult> UpdateItemPricing([FromBody]ItemPrice info)
        {
            _appDbContext.Attach(info);

            _appDbContext.Update(info);

            await _appDbContext.SaveChangesAsync();

            return Ok();
        }


        string GetUserId()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            return userId;
        }
    }
}
