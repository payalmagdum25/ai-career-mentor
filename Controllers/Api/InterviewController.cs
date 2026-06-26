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
    public class InterviewController : ControllerBase
    {
        private readonly IInterviewService _interviewService;
        private readonly ILogger<InterviewController> _logger;

        public InterviewController(IInterviewService interviewService, ILogger<InterviewController> logger)
        {
            _interviewService = interviewService;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        [HttpGet]
        public async Task<IActionResult> GetPastSessions()
        {
            var userId = GetCurrentUserId();
            var sessions = await _interviewService.GetUserSessionsAsync(userId);
            return Ok(sessions);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSessionDetails(int id)
        {
            var session = await _interviewService.GetSessionByIdAsync(id);
            if (session == null || session.UserId != GetCurrentUserId())
            {
                return NotFound(new { message = "Session not found." });
            }
            return Ok(session);
        }

        [HttpPost("start")]
        public async Task<IActionResult> StartSession([FromBody] InterviewStartDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userId = GetCurrentUserId();
                var session = await _interviewService.StartSessionAsync(userId, dto.Technology);
                return Ok(session);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error starting interview session for user {UserId}", GetCurrentUserId());
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("answer")]
        public async Task<IActionResult> SubmitAnswer([FromBody] AnswerSubmitDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var question = await _interviewService.SubmitAnswerAsync(dto.QuestionId, dto.Answer);
                return Ok(question);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error submitting answer for question ID {QuestionId}", dto.QuestionId);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{id}/complete")]
        public async Task<IActionResult> CompleteSession(int id)
        {
            try
            {
                var overallScore = await _interviewService.CompleteSessionAsync(id);
                return Ok(new { message = "Session completed.", overallScore });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error completing interview session {SessionId}", id);
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
