using System.Collections.Generic;
using System.Threading.Tasks;
using JobPrepPortal.Models;

namespace JobPrepPortal.Repositories.Interfaces
{
    public interface ICodeRepository
    {
        Task<CodingProblem?> GetProblemByIdAsync(int problemId);
        Task<IEnumerable<CodingProblem>> GetAllProblemsAsync();
        Task<IEnumerable<CodeSubmission>> GetUserSubmissionsAsync(int userId);
        Task<CodeSubmission> CreateSubmissionAsync(CodeSubmission submission);
        Task<CodingProblem> CreateProblemAsync(CodingProblem problem);
    }
}
