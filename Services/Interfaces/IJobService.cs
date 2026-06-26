using System.Collections.Generic;
using System.Threading.Tasks;
using JobPrepPortal.Models;

namespace JobPrepPortal.Services.Interfaces
{
    public interface IJobService
    {
        Task<IEnumerable<JobRecommendation>> GetRecommendationsAsync(int userId, string? locationPreference);
        Task<IEnumerable<Job>> SearchJobsAsync(string query, string? location, string? type);
    }
}
