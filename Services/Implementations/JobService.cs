using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using JobPrepPortal.Data;
using JobPrepPortal.Models;
using JobPrepPortal.Repositories.Interfaces;
using JobPrepPortal.Services.Interfaces;

namespace JobPrepPortal.Services.Implementations
{
    public class JobService : IJobService
    {
        private readonly IUserRepository _userRepository;
        private readonly IRoadmapRepository _roadmapRepository;
        private readonly IAIService _aiService;
        private readonly ApplicationDbContext _context; // To query global jobs list
        private readonly ILogger<JobService> _logger;

        public JobService(IUserRepository userRepository, IRoadmapRepository roadmapRepository, IAIService aiService, ApplicationDbContext context, ILogger<JobService> logger)
        {
            _userRepository = userRepository;
            _roadmapRepository = roadmapRepository;
            _aiService = aiService;
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<JobRecommendation>> GetRecommendationsAsync(int userId, string? locationPreference)
        {
            _logger.LogInformation("Getting job recommendations for user {UserId}", userId);
            
            // Get user details and skills
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new System.Exception("User not found.");
            }

            var skills = user.UserSkills.Select(us => us.Skill.SkillName).ToList();

            // Clear previous recommendations
            await _roadmapRepository.DeleteUserJobRecommendationsAsync(userId);

            // Fetch from AI Service
            var recommendations = await _aiService.RecommendJobsAsync(userId, skills, locationPreference);

            // Save recommendations
            var recommendationsList = recommendations.ToList();
            await _roadmapRepository.CreateJobRecommendationsAsync(recommendationsList);

            return recommendationsList;
        }

        public async Task<IEnumerable<Job>> SearchJobsAsync(string query, string? location, string? type)
        {
            _logger.LogInformation("Searching jobs with query: {Query}, Location: {Loc}, Type: {Type}", query, location, type);
            
            var jobsQuery = _context.Jobs.AsQueryable();

            if (!string.IsNullOrWhiteSpace(query))
            {
                jobsQuery = jobsQuery.Where(j => j.Title.Contains(query) || j.Company.Contains(query) || j.Description.Contains(query));
            }

            if (!string.IsNullOrWhiteSpace(location))
            {
                jobsQuery = jobsQuery.Where(j => j.Location != null && j.Location.Contains(location));
            }

            if (!string.IsNullOrWhiteSpace(type))
            {
                jobsQuery = jobsQuery.Where(j => j.Type != null && j.Type.Equals(type, System.StringComparison.OrdinalIgnoreCase));
            }

            return await jobsQuery.OrderByDescending(j => j.PostedDate).ToListAsync();
        }
    }
}
