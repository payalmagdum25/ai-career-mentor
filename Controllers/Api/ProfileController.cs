using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using JobPrepPortal.DTOs;
using JobPrepPortal.Services.Interfaces;

namespace JobPrepPortal.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;
        private readonly ILogger<ProfileController> _logger;

        public ProfileController(IProfileService profileService, ILogger<ProfileController> logger)
        {
            _profileService = profileService;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetCurrentUserId();
            var user = await _profileService.GetProfileAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "Profile not found." });
            }

            return Ok(new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Phone,
                user.Role,
                user.ProfileImage,
                user.Github,
                user.Linkedin,
                user.Education,
                user.CreatedAt,
                Skills = user.UserSkills.Select(us => us.Skill.SkillName).ToList()
            });
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileUpdateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userId = GetCurrentUserId();
                var user = await _profileService.UpdateProfileAsync(userId, dto.Name, dto.Phone, dto.Github, dto.Linkedin, dto.Education, dto.Skills);
                return Ok(new
                {
                    message = "Profile updated successfully.",
                    user = new
                    {
                        user.Id,
                        user.Name,
                        user.Email,
                        user.Phone,
                        user.Role,
                        user.ProfileImage,
                        user.Github,
                        user.Linkedin,
                        user.Education,
                        Skills = user.UserSkills.Select(us => us.Skill.SkillName).ToList()
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating profile for user ID {UserId}", GetCurrentUserId());
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No file uploaded." });
            }

            try
            {
                var userId = GetCurrentUserId();
                using (var stream = file.OpenReadStream())
                {
                    var relativePath = await _profileService.UploadProfileImageAsync(userId, file.FileName, stream);
                    return Ok(new { message = "Image uploaded successfully.", profileImage = relativePath });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading profile image for user {UserId}", GetCurrentUserId());
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("notifications")]
        public async Task<IActionResult> GetNotifications()
        {
            var userId = GetCurrentUserId();
            var notifications = await _profileService.GetNotificationsAsync(userId);
            return Ok(notifications);
        }

        [HttpPut("notifications/{id}/read")]
        public async Task<IActionResult> MarkNotificationRead(int id)
        {
            try
            {
                await _profileService.MarkNotificationAsReadAsync(id);
                return Ok(new { message = "Notification marked as read." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
