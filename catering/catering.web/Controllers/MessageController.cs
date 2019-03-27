using catering.web.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace catering.web.Controllers
{
    [Route("api/[controller]")]
    public class MessageController : Controller
    {
        private readonly AppDbContext _appDbContext;
        private readonly IHostingEnvironment _hostingEnvironment;


        public MessageController(AppDbContext appDbContext, IHostingEnvironment hostingEnvironment)
        {
            _appDbContext = appDbContext;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpGet()]
        public async Task<IActionResult> Get()
        {
            var data = await _appDbContext
                .ShortMessages
                .Include(p => p.Reservation)
                    .ThenInclude(p => p.User)
                .OrderByDescending(p => p.DateCreated)
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("forSend")]
        public async Task<IActionResult> GetForSend()
        {
            var data = await _appDbContext
                .ShortMessages
                .Include(p => p.Reservation)
                    .ThenInclude(p => p.User)
                .OrderByDescending(p => p.DateCreated)
                .Where(p=>p.DateSent == null)
                .ToListAsync();

            return Ok(data);
        }


        [HttpPost("sent")]
        public async Task<IActionResult> Sent1(string id)
        {
            var data = await _appDbContext
                .ShortMessages
                .FirstOrDefaultAsync(p => p.ShortMessageId == id);

            if (data == null)
            {
                return NotFound();
            }

            data.DateSent = DateTime.UtcNow;
            data.Result += $"Sent Date: {data.DateSent.ToString()}\n";

            data.SentCount++;

            _appDbContext.Update(data);

            await _appDbContext.SaveChangesAsync();

            return Ok(new { message= $"sms: {data.ShortMessageId} sent"});
        }

        /// <summary>
        /// SHOULD BE HTTPPOST, BUT XAMARIN ANDROID IS CHOKING
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpGet("sent2")]
        public async Task<IActionResult> Sent2(string id)
        {
            var data = await _appDbContext
                .ShortMessages
                .FirstOrDefaultAsync(p => p.ShortMessageId == id);

            if (data == null)
            {
                return NotFound();
            }

            data.DateSent = DateTime.UtcNow;
            data.Result += $"Sent Date: {data.DateSent.ToString()};";

            data.SentCount++;

            _appDbContext.Update(data);

            await _appDbContext.SaveChangesAsync();

            return Ok(new { message = $"sms [{data.ShortMessageId}] sent" });
        }

        [HttpPost("resend/{id}")]
        public async Task<IActionResult> Resend(string id)
        {
            var data = await _appDbContext
                .ShortMessages
                .FirstOrDefaultAsync(p => p.ShortMessageId == id);

            if (data == null)
            {
                return NotFound();
            }

            data.DateSent = null;
            data.Result += $"Resend;";

            _appDbContext.Update(data);

            await _appDbContext.SaveChangesAsync();

            return Ok();
        }
    }

    public class Sent2
    {
        public string Id { get; set; }
    }
}
