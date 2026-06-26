using System.Collections.Generic;
using System.Threading.Tasks;
using JobPrepPortal.Models;

namespace JobPrepPortal.Repositories.Interfaces
{
    public interface IRoadmapRepository
    {
        Task<LearningRoadmap?> GetByIdAsync(int id);
        Task<IEnumerable<LearningRoadmap>> GetUserRoadmapsAsync(int userId);
        Task<LearningRoadmap> CreateAsync(LearningRoadmap roadmap);
        Task CreateRangeAsync(IEnumerable<LearningRoadmap> roadmaps);
        Task UpdateAsync(LearningRoadmap roadmap);
        Task DeleteUserRoadmapsAsync(int userId);
        Task<IEnumerable<JobRecommendation>> GetUserJobRecommendationsAsync(int userId);
        Task CreateJobRecommendationsAsync(IEnumerable<JobRecommendation> recommendations);
        Task DeleteUserJobRecommendationsAsync(int userId);
    }
}
