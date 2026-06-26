using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using JobPrepPortal.Data;
using JobPrepPortal.Models;
using JobPrepPortal.Repositories.Interfaces;

namespace JobPrepPortal.Repositories.Implementations
{
    public class ResumeRepository : IResumeRepository
    {
        private readonly ApplicationDbContext _context;

        public ResumeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ResumeAnalysis?> GetByIdAsync(int id)
        {
            return await _context.ResumeAnalyses
                .Include(r => r.Feedbacks)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<ResumeAnalysis>> GetUserAnalysesAsync(int userId)
        {
            return await _context.ResumeAnalyses
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedDate)
                .ToListAsync();
        }

        public async Task<ResumeAnalysis> CreateAsync(ResumeAnalysis analysis)
        {
            await _context.ResumeAnalyses.AddAsync(analysis);
            await _context.SaveChangesAsync();
            return analysis;
        }

        public async Task AddFeedbackAsync(IEnumerable<ResumeFeedback> feedbackItems)
        {
            await _context.ResumeFeedbacks.AddRangeAsync(feedbackItems);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ResumeFeedback>> GetFeedbackByAnalysisIdAsync(int analysisId)
        {
            return await _context.ResumeFeedbacks
                .Where(rf => rf.ResumeAnalysisId == analysisId)
                .ToListAsync();
        }
    }
}
