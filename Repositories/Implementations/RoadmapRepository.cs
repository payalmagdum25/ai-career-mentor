using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using JobPrepPortal.Data;
using JobPrepPortal.Models;
using JobPrepPortal.Repositories.Interfaces;

namespace JobPrepPortal.Repositories.Implementations
{
    public class RoadmapRepository : IRoadmapRepository
    {
        private readonly ApplicationDbContext _context;

        public RoadmapRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<LearningRoadmap?> GetByIdAsync(int id)
        {
            return await _context.LearningRoadmaps.FindAsync(id);
        }

        public async Task<IEnumerable<LearningRoadmap>> GetUserRoadmapsAsync(int userId)
        {
            return await _context.LearningRoadmaps
                .Where(r => r.UserId == userId)
                .OrderBy(r => r.TargetDate)
                .ToListAsync();
        }

        public async Task<LearningRoadmap> CreateAsync(LearningRoadmap roadmap)
        {
            await _context.LearningRoadmaps.AddAsync(roadmap);
            await _context.SaveChangesAsync();
            return roadmap;
        }

        public async Task CreateRangeAsync(IEnumerable<LearningRoadmap> roadmaps)
        {
            await _context.LearningRoadmaps.AddRangeAsync(roadmaps);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(LearningRoadmap roadmap)
        {
            _context.LearningRoadmaps.Update(roadmap);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUserRoadmapsAsync(int userId)
        {
            var roadmaps = await _context.LearningRoadmaps.Where(r => r.UserId == userId).ToListAsync();
            _context.LearningRoadmaps.RemoveRange(roadmaps);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<JobRecommendation>> GetUserJobRecommendationsAsync(int userId)
        {
            return await _context.JobRecommendations
                .Where(j => j.UserId == userId)
                .OrderByDescending(j => j.MatchPercentage)
                .ToListAsync();
        }

        public async Task CreateJobRecommendationsAsync(IEnumerable<JobRecommendation> recommendations)
        {
            await _context.JobRecommendations.AddRangeAsync(recommendations);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUserJobRecommendationsAsync(int userId)
        {
            var recommendations = await _context.JobRecommendations.Where(j => j.UserId == userId).ToListAsync();
            _context.JobRecommendations.RemoveRange(recommendations);
            await _context.SaveChangesAsync();
        }
    }
}
