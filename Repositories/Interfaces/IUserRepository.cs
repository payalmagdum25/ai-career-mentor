using System.Collections.Generic;
using System.Threading.Tasks;
using JobPrepPortal.Models;

namespace JobPrepPortal.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByEmailAsync(string email);
        Task<User> CreateAsync(User user);
        Task UpdateAsync(User user);
        Task<IEnumerable<Skill>> GetUserSkillsAsync(int userId);
        Task AddSkillToUserAsync(int userId, int skillId);
        Task RemoveSkillFromUserAsync(int userId, int skillId);
        Task<Skill?> GetSkillByNameAsync(string skillName);
        Task<Skill> CreateSkillAsync(Skill skill);
        Task<IEnumerable<Notification>> GetUserNotificationsAsync(int userId);
        Task AddNotificationAsync(Notification notification);
        Task MarkNotificationAsReadAsync(int notificationId);
    }
}
