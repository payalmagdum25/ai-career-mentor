using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using JobPrepPortal.Models;
using JobPrepPortal.Repositories.Interfaces;
using JobPrepPortal.Services.Interfaces;
using JobPrepPortal.Data;

namespace JobPrepPortal.Services.Implementations
{
    public class ProfileService : IProfileService
    {
        private readonly IUserRepository _userRepository;
        private readonly IWebHostEnvironment _env;
        private readonly ApplicationDbContext _context; // To manage UserSkill mapping directly
        private readonly ILogger<ProfileService> _logger;

        public ProfileService(IUserRepository userRepository, IWebHostEnvironment env, ApplicationDbContext context, ILogger<ProfileService> logger)
        {
            _userRepository = userRepository;
            _env = env;
            _context = context;
            _logger = logger;
        }

        public async Task<User?> GetProfileAsync(int userId)
        {
            return await _userRepository.GetByIdAsync(userId);
        }

        public async Task<User> UpdateProfileAsync(int userId, string name, string? phone, string? github, string? linkedin, string? education, IEnumerable<string> skills)
        {
            _logger.LogInformation("Updating profile for user ID {UserId}", userId);
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found.");
            }

            user.Name = name;
            user.Phone = phone;
            user.Github = github;
            user.Linkedin = linkedin;
            user.Education = education;

            await _userRepository.UpdateAsync(user);

            // Update skills many-to-many
            // 1. Remove existing skills
            var existingUserSkills = _context.UserSkills.Where(us => us.UserId == userId);
            _context.UserSkills.RemoveRange(existingUserSkills);
            await _context.SaveChangesAsync();

            // 2. Add new skills
            foreach (var skillName in skills)
            {
                var skill = await _userRepository.GetSkillByNameAsync(skillName);
                if (skill == null)
                {
                    skill = new Skill { SkillName = skillName };
                    await _userRepository.CreateSkillAsync(skill);
                }

                await _userRepository.AddSkillToUserAsync(userId, skill.Id);
            }

            // Fetch final updated user
            return (await _userRepository.GetByIdAsync(userId))!;
        }

        public async Task<string> UploadProfileImageAsync(int userId, string fileName, Stream fileStream)
        {
            _logger.LogInformation("Uploading profile image for user {UserId}, original filename: {FileName}", userId, fileName);
            
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found.");
            }

            var extension = Path.GetExtension(fileName);
            var uniqueFileName = $"profile_{userId}_{Guid.NewGuid()}{extension}";
            
            var profileFolder = Path.Combine(_env.WebRootPath, "images", "profiles");
            if (!Directory.Exists(profileFolder))
            {
                Directory.CreateDirectory(profileFolder);
            }

            var filePath = Path.Combine(profileFolder, uniqueFileName);
            using (var destinationStream = new FileStream(filePath, FileMode.Create))
            {
                await fileStream.CopyToAsync(destinationStream);
            }

            var relativePath = $"/images/profiles/{uniqueFileName}";
            user.ProfileImage = relativePath;
            await _userRepository.UpdateAsync(user);

            _logger.LogInformation("Profile image successfully saved. Relative path: {Path}", relativePath);
            return relativePath;
        }

        public async Task<IEnumerable<Notification>> GetNotificationsAsync(int userId)
        {
            return await _userRepository.GetUserNotificationsAsync(userId);
        }

        public async Task MarkNotificationAsReadAsync(int notificationId)
        {
            await _userRepository.MarkNotificationAsReadAsync(notificationId);
        }

        public async Task AddNotificationAsync(int userId, string title, string message)
        {
            var notification = new Notification
            {
                UserId = userId,
                Title = title,
                Message = message,
                IsRead = false,
                CreatedDate = DateTime.UtcNow
            };
            await _userRepository.AddNotificationAsync(notification);
        }
    }
}
