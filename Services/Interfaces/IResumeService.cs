using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using JobPrepPortal.Models;

namespace JobPrepPortal.Services.Interfaces
{
    public interface IResumeService
    {
        Task<ResumeAnalysis> AnalyzeResumeAsync(int userId, string fileName, Stream fileStream);
        Task<ResumeAnalysis?> GetAnalysisByIdAsync(int id);
        Task<IEnumerable<ResumeAnalysis>> GetUserAnalysesAsync(int userId);
    }
}
