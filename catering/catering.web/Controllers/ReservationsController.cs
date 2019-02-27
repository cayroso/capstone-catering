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
        

        string GetUserId()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            return userId;
        }
    }
}
