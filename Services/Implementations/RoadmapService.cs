using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using JobPrepPortal.Models;
using JobPrepPortal.Repositories.Interfaces;
using JobPrepPortal.Services.Interfaces;

namespace JobPrepPortal.Services.Implementations
{
    public class RoadmapService : IRoadmapService
    {
        private readonly IRoadmapRepository _roadmapRepository;
        private readonly IAIService _aiService;
        private readonly ILogger<RoadmapService> _logger;

        public RoadmapService(IRoadmapRepository roadmapRepository, IAIService aiService, ILogger<RoadmapService> logger)
        {
            _roadmapRepository = roadmapRepository;
            _aiService = aiService;
            _logger = logger;
        }

        public async Task<IEnumerable<LearningRoadmap>> GenerateRoadmapForUserAsync(int userId, string targetRole, IEnumerable<string> targetSkills)
        {
            _logger.LogInformation("Generating fresh learning roadmap for user {UserId} targeting role {Role}", userId, targetRole);
            
            // Delete previous roadmap tasks
            await _roadmapRepository.DeleteUserRoadmapsAsync(userId);

            // Generate using AI Service
            var roadmaps = await _aiService.GenerateRoadmapAsync(userId, targetRole, targetSkills);

            // Save to DB
            await _roadmapRepository.CreateRangeAsync(roadmaps);

            return roadmaps;
        }

        public async Task<IEnumerable<LearningRoadmap>> GetUserRoadmapsAsync(int userId)
        {
            return await _roadmapRepository.GetUserRoadmapsAsync(userId);
        }

        public async Task<LearningRoadmap?> ToggleTaskCompletionAsync(int taskId)
        {
            _logger.LogInformation("Toggling completion status for roadmap task ID {TaskId}", taskId);
            var task = await _roadmapRepository.GetByIdAsync(taskId);
            if (task != null)
            {
                task.Completed = !task.Completed;
                await _roadmapRepository.UpdateAsync(task);
            }
            return task;
        }
    }
}
