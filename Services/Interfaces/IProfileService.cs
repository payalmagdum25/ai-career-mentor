using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using JobPrepPortal.Models;

namespace JobPrepPortal.Services.Interfaces
{
    public interface IProfileService
    {
        Task<User?> GetProfileAsync(int userId);
        Task<User> UpdateProfileAsync(int userId, string name, string? phone, string? github, string? linkedin, string? education, IEnumerable<string> skills);
        Task<string> UploadProfileImageAsync(int userId, string fileName, Stream fileStream);
        Task<IEnumerable<Notification>> GetNotificationsAsync(int userId);
        Task MarkNotificationAsReadAsync(int notificationId);
        Task AddNotificationAsync(int userId, string title, string message);
    }
}
