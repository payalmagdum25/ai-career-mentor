using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JobPrepPortal.Data;
using JobPrepPortal.Models;

namespace JobPrepPortal.Controllers
{
    public class DsaController : Controller
    {
        private readonly ApplicationDbContext _context;

        public DsaController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Dsa
        public async Task<IActionResult> Index()
        {
            var problems = await _context.DsaProblems
                .GroupBy(p => p.Topic)
                .ToListAsync();
            
            return View(problems);
        }
    }
}
