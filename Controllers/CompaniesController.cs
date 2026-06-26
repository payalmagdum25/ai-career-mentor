using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JobPrepPortal.Data;
using JobPrepPortal.Models;

namespace JobPrepPortal.Controllers
{
    public class CompaniesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CompaniesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Companies
        public async Task<IActionResult> Index()
        {
            var companies = await _context.CompanyProfiles.ToListAsync();
            return View(companies);
        }

        // GET: Companies/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null) return NotFound();

            var company = await _context.CompanyProfiles.FirstOrDefaultAsync(m => m.Id == id);
            if (company == null) return NotFound();

            return View(company);
        }
    }
}
