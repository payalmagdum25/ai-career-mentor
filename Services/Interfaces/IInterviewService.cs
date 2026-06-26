using System.Collections.Generic;
using System.Threading.Tasks;
using JobPrepPortal.Models;

namespace JobPrepPortal.Services.Interfaces
{
    public interface IInterviewService
    {
        Task<InterviewSession> StartSessionAsync(int userId, string technology);
        Task<InterviewSession?> GetSessionByIdAsync(int id);
        Task<IEnumerable<InterviewSession>> GetUserSessionsAsync(int userId);
        Task<InterviewQuestion> SubmitAnswerAsync(int questionId, string answer);
        Task<int> CompleteSessionAsync(int sessionId);
    }
}
