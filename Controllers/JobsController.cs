using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JobPrepPortal.Data;
using JobPrepPortal.Models;

namespace JobPrepPortal.Controllers
{
    public class JobsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public JobsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Jobs
        public async Task<IActionResult> Index()
        {
            var jobs = await _context.Jobs.ToListAsync();
            return View(jobs);
        }

        // GET: Jobs/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null) return NotFound();

            var job = await _context.Jobs.FirstOrDefaultAsync(m => m.Id == id);
            if (job == null) return NotFound();

            return View(job);
        }
    }
}
