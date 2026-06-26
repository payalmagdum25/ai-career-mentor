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
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        private readonly ILogger<ChatController> _logger;

        public ChatController(IChatService chatService, ILogger<ChatController> logger)
        {
            _chatService = chatService;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        [HttpGet]
        public async Task<IActionResult> GetSessions()
        {
            var userId = GetCurrentUserId();
            var sessions = await _chatService.GetUserSessionsAsync(userId);
            return Ok(sessions);
        }

        [HttpGet("{sessionId}")]
        public async Task<IActionResult> GetSessionDetails(int sessionId)
        {
            var session = await _chatService.GetSessionByIdAsync(sessionId);
            if (session == null || session.UserId != GetCurrentUserId())
            {
                return NotFound(new { message = "Session not found." });
            }
            return Ok(session);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSession([FromBody] ChatCreateDto dto)
        {
            var userId = GetCurrentUserId();
            var session = await _chatService.CreateSessionAsync(userId, dto.Title);
            return Ok(session);
        }

        [HttpPost("{sessionId}/message")]
        public async Task<IActionResult> SendMessage(int sessionId, [FromBody] MessageSendDto dto)
        {
            try
            {
                var session = await _chatService.GetSessionByIdAsync(sessionId);
                if (session == null || session.UserId != GetCurrentUserId())
                {
                    return NotFound(new { message = "Session not found." });
                }

                // Send User message and generate AI response
                var aiMsg = await _chatService.SendMessageAsync(sessionId, dto.MessageText, "User");
                
                // Return AI response message details to client
                return Ok(aiMsg);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error posting message to session {SessionId}", sessionId);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{sessionId}")]
        public async Task<IActionResult> DeleteSession(int sessionId)
        {
            try
            {
                var session = await _chatService.GetSessionByIdAsync(sessionId);
                if (session == null || session.UserId != GetCurrentUserId())
                {
                    return NotFound(new { message = "Session not found." });
                }

                await _chatService.DeleteSessionAsync(sessionId);
                return Ok(new { message = "Session deleted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest(new { message = "Query cannot be empty." });
            }

            var userId = GetCurrentUserId();
            var matches = await _chatService.SearchHistoryAsync(userId, query);
            return Ok(matches);
        }
    }
}
