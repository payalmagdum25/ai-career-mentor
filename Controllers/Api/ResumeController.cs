using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using JobPrepPortal.Services.Interfaces;

namespace JobPrepPortal.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ResumeController : ControllerBase
    {
        private readonly IResumeService _resumeService;
        private readonly ILogger<ResumeController> _logger;

        public ResumeController(IResumeService resumeService, ILogger<ResumeController> logger)
        {
            _resumeService = resumeService;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> UploadAndAnalyze(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No file uploaded. Please select a PDF or DOCX file." });
            }

            var extension = System.IO.Path.GetExtension(file.FileName).ToLower();
            if (extension != ".pdf" && extension != ".docx" && extension != ".doc")
            {
                return BadRequest(new { message = "Invalid file extension. Please upload a PDF or Word document." });
            }

            try
            {
                var userId = GetCurrentUserId();
                using (var stream = file.OpenReadStream())
                {
                    var result = await _resumeService.AnalyzeResumeAsync(userId, file.FileName, stream);
                    return Ok(new
                    {
                        message = "Resume analyzed successfully.",
                        analysis = new
                        {
                            result.Id,
                            result.FileName,
                            result.ResumeScore,
                            result.CreatedDate
                        }
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during resume analysis for user ID {UserId}", GetCurrentUserId());
                return StatusCode(500, new { message = "Failed to analyze resume. " + ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAnalysisHistory()
        {
            var userId = GetCurrentUserId();
            var history = await _resumeService.GetUserAnalysesAsync(userId);
            return Ok(history);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAnalysisDetails(int id)
        {
            var analysis = await _resumeService.GetAnalysisByIdAsync(id);
            if (analysis == null || analysis.UserId != GetCurrentUserId())
            {
                return NotFound(new { message = "Analysis report not found." });
            }
            return Ok(analysis);
        }
    }
}
