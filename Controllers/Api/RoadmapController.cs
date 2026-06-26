using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using JobPrepPortal.DTOs;
using JobPrepPortal.Services.Interfaces;

namespace JobPrepPortal.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RoadmapController : ControllerBase
    {
        private readonly IRoadmapService _roadmapService;
        private readonly ILogger<RoadmapController> _logger;

        public RoadmapController(IRoadmapService roadmapService, ILogger<RoadmapController> logger)
        {
            _roadmapService = roadmapService;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        [HttpGet]
        public async Task<IActionResult> GetRoadmap()
        {
            var userId = GetCurrentUserId();
            var roadmap = await _roadmapService.GetUserRoadmapsAsync(userId);
            return Ok(roadmap);
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateRoadmap([FromBody] RoadmapGenerateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userId = GetCurrentUserId();
                var roadmap = await _roadmapService.GenerateRoadmapForUserAsync(userId, dto.TargetRole, dto.TargetSkills);
                return Ok(roadmap);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating roadmap for user {UserId}", GetCurrentUserId());
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("task/{id}/toggle")]
        public async Task<IActionResult> ToggleTask(int id)
        {
            try
            {
                var task = await _roadmapService.ToggleTaskCompletionAsync(id);
                if (task == null || task.UserId != GetCurrentUserId())
                {
                    return NotFound(new { message = "Roadmap task not found." });
                }
                return Ok(task);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
