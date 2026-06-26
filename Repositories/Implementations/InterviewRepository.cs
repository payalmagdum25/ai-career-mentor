using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using JobPrepPortal.Data;
using JobPrepPortal.Models;
using JobPrepPortal.Repositories.Interfaces;

namespace JobPrepPortal.Repositories.Implementations
{
    public class InterviewRepository : IInterviewRepository
    {
        private readonly ApplicationDbContext _context;

        public InterviewRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<InterviewSession?> GetByIdAsync(int id)
        {
            return await _context.InterviewSessions
                .Include(s => s.Questions)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<IEnumerable<InterviewSession>> GetUserSessionsAsync(int userId)
        {
            return await _context.InterviewSessions
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.CreatedDate)
                .ToListAsync();
        }

        public async Task<InterviewSession> CreateSessionAsync(InterviewSession session)
        {
            await _context.InterviewSessions.AddAsync(session);
            await _context.SaveChangesAsync();
            return session;
        }

        public async Task AddQuestionsAsync(IEnumerable<InterviewQuestion> questions)
        {
            await _context.InterviewQuestions.AddRangeAsync(questions);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateQuestionAsync(InterviewQuestion question)
        {
            _context.InterviewQuestions.Update(question);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateSessionScoreAsync(int sessionId, int score)
        {
            var session = await _context.InterviewSessions.FindAsync(sessionId);
            if (session != null)
            {
                session.Score = score;
                await _context.SaveChangesAsync();
            }
        }
    }
}
