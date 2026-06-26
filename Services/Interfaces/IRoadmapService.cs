using System.Collections.Generic;
using System.Threading.Tasks;
using JobPrepPortal.Models;

namespace JobPrepPortal.Services.Interfaces
{
    public interface IRoadmapService
    {
        Task<IEnumerable<LearningRoadmap>> GenerateRoadmapForUserAsync(int userId, string targetRole, IEnumerable<string> targetSkills);
        Task<IEnumerable<LearningRoadmap>> GetUserRoadmapsAsync(int userId);
        Task<LearningRoadmap?> ToggleTaskCompletionAsync(int taskId);
    }
}
