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
    [Authorize]
    [Route("api/[controller]")]
    public class CustomerController : Controller
    {
        private readonly AppDbContext _appDbContext;


        public CustomerController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpGet("reservations")]
        public async Task<IActionResult> Reservations()
        {
            var items = await _appDbContext
                .Reservations
                .Include(p => p.Notes)
                .Include(p => p.Package)
                    .ThenInclude(p => p.Items)
                .Include(p => p.PackageItems)
                .Where(p => p.UserId == GetUserId())
                .ToListAsync();

            return Ok(items);
        }

        [HttpPost("payReservation/{id}")]
        public async Task<IActionResult> PayReservation(string id, decimal amountPaid, string referenceNumber)
        {
            var reservation = await _appDbContext
                .Reservations
                .Include(p => p.Notes)
                .FirstOrDefaultAsync(p => p.UserId == GetUserId() && p.ReservationId == id);


            if (reservation == null)
            {
                return NotFound();
            }

            reservation.ReservationStatus = ReservationStatus.Paid;
            reservation.AmountPaid = amountPaid;
            reservation.ReferenceNumber = referenceNumber;

            await _appDbContext.SaveChangesAsync();

            //  TODO: send SMS to admin and customer that the system accepted the 
            //  payment and reference number
            return Ok();
        }

        [HttpPost("cancelReservation/{id}")]
        public async Task<IActionResult> CancelReservation(string id)
        {

            var reservation = await _appDbContext
                .Reservations
                .Include(p => p.Notes)
                .FirstOrDefaultAsync(p => p.UserId == GetUserId() && p.ReservationId == id);


            if (reservation == null)
            {
                return NotFound();
            }

            reservation.ReservationStatus = ReservationStatus.Cancelled;

            await _appDbContext.SaveChangesAsync();

            //  TODO: send sms to admin + customer that a reservation was cancelled
            return Ok();
        }


        string GetUserId()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            return userId;
        }
    }
}
