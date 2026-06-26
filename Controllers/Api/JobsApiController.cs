using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using JobPrepPortal.Services.Interfaces;

namespace JobPrepPortal.Controllers.Api
{
    [ApiController]
    [Route("api/jobs")]
    [Authorize]
    public class JobsApiController : ControllerBase
    {
        private readonly IJobService _jobService;
        private readonly ILogger<JobsApiController> _logger;

        public JobsApiController(IJobService jobService, ILogger<JobsApiController> logger)
        {
            _jobService = jobService;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        [HttpGet("recommendations")]
        public async Task<IActionResult> GetRecommendations([FromQuery] string? location)
        {
            try
            {
                var userId = GetCurrentUserId();
                var recommendations = await _jobService.GetRecommendationsAsync(userId, location);
                return Ok(recommendations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting job recommendations for user {UserId}", GetCurrentUserId());
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string? query, [FromQuery] string? location, [FromQuery] string? type)
        {
            try
            {
                var jobs = await _jobService.SearchJobsAsync(query ?? string.Empty, location, type);
                return Ok(jobs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching jobs");
                return StatusCode(500, new { message = "An error occurred." });
            }
        }
    }
}
