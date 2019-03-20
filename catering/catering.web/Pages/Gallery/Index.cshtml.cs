using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using catering.web.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace catering.web.Pages.Gallery
{
    public class IndexModel : PageModel
    {
        private readonly AppDbContext _appDbContext;

        public IndexModel(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [BindProperty]
        public List<Package> Packages { get; set; }

        public async Task OnGet()
        {
            var items = await _appDbContext
                .Packages
                .Include(p => p.Images)
                .Include(p => p.Items)
                .ToListAsync();

            Packages = items;
        }
    }
}