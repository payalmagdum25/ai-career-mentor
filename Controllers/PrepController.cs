using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JobPrepPortal.Data;
using JobPrepPortal.Models;

namespace JobPrepPortal.Controllers
{
    public class PrepController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PrepController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Prep
        public async Task<IActionResult> Index()
        {
            var categories = await _context.PrepMaterials
                .Select(m => m.Category)
                .Distinct()
                .ToListAsync();
            return View(categories);
        }

        // GET: Prep/Category/Aptitude
        public async Task<IActionResult> Category(string id)
        {
            if (string.IsNullOrEmpty(id)) return NotFound();

            var materials = await _context.PrepMaterials
                .Where(m => m.Category == id)
                .ToListAsync();
            
            ViewBag.Category = id;
            return View(materials);
        }

        // GET: Prep/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null) return NotFound();

            var material = await _context.PrepMaterials
                .Include(m => m.PracticeProblems)
                .FirstOrDefaultAsync(m => m.Id == id);
            
            if (material == null) return NotFound();

            return View(material);
        }
    }
}
