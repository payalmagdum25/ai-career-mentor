using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using JobPrepPortal.Data;
using JobPrepPortal.Models;
using JobPrepPortal.Repositories.Interfaces;

namespace JobPrepPortal.Repositories.Implementations
{
    public class CodeRepository : ICodeRepository
    {
        private readonly ApplicationDbContext _context;

        public CodeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CodingProblem?> GetProblemByIdAsync(int problemId)
        {
            return await _context.CodingProblems
                .Include(p => p.Submissions)
                .FirstOrDefaultAsync(p => p.Id == problemId);
        }

        public async Task<IEnumerable<CodingProblem>> GetAllProblemsAsync()
        {
            return await _context.CodingProblems.ToListAsync();
        }

        public async Task<IEnumerable<CodeSubmission>> GetUserSubmissionsAsync(int userId)
        {
            return await _context.CodeSubmissions
                .Include(s => s.CodingProblem)
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.SubmittedDate)
                .ToListAsync();
        }

        public async Task<CodeSubmission> CreateSubmissionAsync(CodeSubmission submission)
        {
            await _context.CodeSubmissions.AddAsync(submission);
            await _context.SaveChangesAsync();
            return submission;
        }

        public async Task<CodingProblem> CreateProblemAsync(CodingProblem problem)
        {
            await _context.CodingProblems.AddAsync(problem);
            await _context.SaveChangesAsync();
            return problem;
        }
    }
}
