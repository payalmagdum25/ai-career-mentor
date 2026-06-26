using System.Collections.Generic;
using System.Threading.Tasks;
using JobPrepPortal.Models;

namespace JobPrepPortal.Repositories.Interfaces
{
    public interface IInterviewRepository
    {
        Task<InterviewSession?> GetByIdAsync(int id);
        Task<IEnumerable<InterviewSession>> GetUserSessionsAsync(int userId);
        Task<InterviewSession> CreateSessionAsync(InterviewSession session);
        Task AddQuestionsAsync(IEnumerable<InterviewQuestion> questions);
        Task UpdateQuestionAsync(InterviewQuestion question);
        Task UpdateSessionScoreAsync(int sessionId, int score);
    }
}
