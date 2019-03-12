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
            var items = await _appDbContext
                .ShortMessages
                //.Where(p => p.DateSent == null)
                .ToListAsync();

            return Ok(items);
        }

        
        [HttpPost("sent/{id}")]
        public async Task<IActionResult> Sent(string id)
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

            return Ok();
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
            data.Result += $"Resend Date: {data.DateSent.ToString()}\n";

            _appDbContext.Update(data);

            await _appDbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
