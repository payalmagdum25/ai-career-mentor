using System.Collections.Generic;
using System.Threading.Tasks;
using JobPrepPortal.Models;

namespace JobPrepPortal.Repositories.Interfaces
{
    public interface IResumeRepository
    {
        Task<ResumeAnalysis?> GetByIdAsync(int id);
        Task<IEnumerable<ResumeAnalysis>> GetUserAnalysesAsync(int userId);
        Task<ResumeAnalysis> CreateAsync(ResumeAnalysis analysis);
        Task AddFeedbackAsync(IEnumerable<ResumeFeedback> feedbackItems);
        Task<IEnumerable<ResumeFeedback>> GetFeedbackByAnalysisIdAsync(int analysisId);
    }
}
