using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using catering.web.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Stripe;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace catering.web.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class CustomerController : Controller
    {
        private readonly AppDbContext _appDbContext;
        private readonly IConfiguration _configuration;

        public CustomerController(AppDbContext appDbContext, IConfiguration configuration)
        {
            _configuration = configuration;
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
                .Include(p => p.ReservationItems)
                
                .Where(p => p.UserId == GetUserId())
                .ToListAsync();

            items.ForEach(p =>
            {
                p.DateStart = new DateTime(p.DateStart.Ticks, DateTimeKind.Utc);
                p.DateEnd = new DateTime(p.DateEnd.Ticks, DateTimeKind.Utc);
            });

            return Ok(items);
        }

        public class PayReservationInfo
        {
            public string Id { get; set; }
            public decimal AmountPaid { get; set; }
            public string ReferenceNumber { get; set; }
        }
        [HttpPost("reservation/pay")]
        public async Task<IActionResult> PayReservation([FromBody]PayReservationInfo info)
        {
            var reservation = await _appDbContext
                .Reservations
                .Include(p => p.Notes)
                .Include(p=> p.User)
                .FirstOrDefaultAsync(p => p.UserId == GetUserId() && p.ReservationId == info.Id);


            if (reservation == null)
            {
                return NotFound();
            }

            reservation.ReservationStatus = ReservationStatus.PaymentSent;
            reservation.AmountPaid = info.AmountPaid;
            reservation.ReferenceNumber = info.ReferenceNumber;

            var body = $"Your payment with reference # {reservation.ReferenceNumber} was Accepted by the system.";
            await SendNotification(reservation.ReservationId, "system", reservation.User.Mobile, "Reservation Payment Accepted", body);
            
            await _appDbContext.SaveChangesAsync();
            
            return Ok();
        }

        [HttpPost("cancelReservation/{id}")]
        public async Task<IActionResult> CancelReservation(string id)
        {

            var reservation = await _appDbContext
                .Reservations
                .Include(p => p.Notes)
                .Include(p=> p.User)
                .FirstOrDefaultAsync(p => p.UserId == GetUserId() && p.ReservationId == id);


            if (reservation == null)
            {
                return NotFound();
            }

            var now = DateTime.UtcNow.Date;

            //  cannot cancel if reservation is paid and due tomorrow
            if(reservation.ReservationStatus == ReservationStatus.PaymentAccepted && now.AddDays(1) >= reservation.DateStart )
            {
                var body1 = $"Your reservation with payment reference # {reservation.ReferenceNumber} cannot be cancelled due to being already paid and due tomorrow.";
                await SendNotification(reservation.ReservationId, "system", reservation.User.Mobile, "Cancel Reservation Rejected", body1);

                await _appDbContext.SaveChangesAsync();

                return BadRequest("Cancel reservation was not accepted because it is already paid and due tomorrow");
            }

            reservation.ReservationStatus = ReservationStatus.Cancelled;

            var body2 = $"Your reservation was cancelled by the system.";
            await SendNotification(reservation.ReservationId, "system", reservation.User.Mobile, "Cancel Reservation Accepted", body2);

            await _appDbContext.SaveChangesAsync();

            //  TODO: send sms to admin + customer that a reservation was cancelled
            return Ok();
        }

        [HttpPost("reservations/pay-with-stripe")]
        public async Task<IActionResult> PayWithStripe()
        {
            try
            {
                var token = Request.Form["stripeToken"];
                var amount = (long)(decimal.Parse(Request.Form["amount"])*100);
                var reservationId = Request.Form["reservationId"];

                var data = await _appDbContext.Reservations
                    .Include(p=> p.User)
                    .FirstOrDefaultAsync(p => p.ReservationId == reservationId);

                if (data == null)
                {
                    return BadRequest("Reservation was not found");
                }

                var apiKey = _configuration.GetSection("AppSettings")["StripeSecret"];
                StripeConfiguration.SetApiKey(apiKey);
                
                var options = new ChargeCreateOptions
                {
                    Amount = amount,
                    Currency = "usd",
                    Description = $"Payment for Reservation {data.ReservationId}",
                    SourceId = token,
                };
                var service = new ChargeService();
                Charge charge = service.Create(options);

                data.ReferenceNumber = charge.Id;

                var body = $"Your payment with reference # {data.ReferenceNumber} was Accepted by the system.";
                await SendNotification(data.ReservationId, "system", data.User.Mobile, "Reservation Payment Accepted", body);

                _appDbContext.Update(data);

                return Ok(charge);
            }
            catch(Exception ex)
            {
                return BadRequest(ex);
            }
        }

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
}
