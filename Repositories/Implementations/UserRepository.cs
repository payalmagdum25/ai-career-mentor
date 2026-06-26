using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using JobPrepPortal.Data;
using JobPrepPortal.Models;
using JobPrepPortal.Repositories.Interfaces;

namespace JobPrepPortal.Repositories.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users
                .Include(u => u.UserSkills)
                    .ThenInclude(us => us.Skill)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.UserSkills)
                    .ThenInclude(us => us.Skill)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<User> CreateAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Skill>> GetUserSkillsAsync(int userId)
        {
            return await _context.UserSkills
                .Where(us => us.UserId == userId)
                .Select(us => us.Skill)
                .ToListAsync();
        }

        public async Task AddSkillToUserAsync(int userId, int skillId)
        {
            var exists = await _context.UserSkills
                .AnyAsync(us => us.UserId == userId && us.SkillId == skillId);
            if (!exists)
            {
                await _context.UserSkills.AddAsync(new UserSkill { UserId = userId, SkillId = skillId });
                await _context.SaveChangesAsync();
            }
        }

        public async Task RemoveSkillFromUserAsync(int userId, int skillId)
        {
            var userSkill = await _context.UserSkills
                .FirstOrDefaultAsync(us => us.UserId == userId && us.SkillId == skillId);
            if (userSkill != null)
            {
                _context.UserSkills.Remove(userSkill);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Skill?> GetSkillByNameAsync(string skillName)
        {
            return await _context.Skills
                .FirstOrDefaultAsync(s => s.SkillName.ToLower() == skillName.ToLower());
        }

        public async Task<Skill> CreateSkillAsync(Skill skill)
        {
            await _context.Skills.AddAsync(skill);
            await _context.SaveChangesAsync();
            return skill;
        }

        public async Task<IEnumerable<Notification>> GetUserNotificationsAsync(int userId)
        {
            return await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedDate)
                .ToListAsync();
        }

        public async Task AddNotificationAsync(Notification notification)
        {
            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();
        }

        public async Task MarkNotificationAsReadAsync(int notificationId)
        {
            var notification = await _context.Notifications.FindAsync(notificationId);
            if (notification != null)
            {
                notification.IsRead = true;
                await _context.SaveChangesAsync();
            }
        }
    }
}
