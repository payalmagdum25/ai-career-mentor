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
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = await _authService.RegisterAsync(dto.Name, dto.Email, dto.Phone, dto.Password, dto.Role);
                if (user == null)
                {
                    return BadRequest(new { message = "Registration failed." });
                }

                _logger.LogInformation("Registration successful for {Email}", dto.Email);
                return Ok(new { message = "User registered successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception occurred during user registration: {Email}", dto.Email);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var (user, token) = await _authService.LoginAsync(dto.Email, dto.Password);
                if (user == null || token == null)
                {
                    return Unauthorized(new { message = "Invalid email or password." });
                }

                _logger.LogInformation("Login successful for {Email}", dto.Email);
                return Ok(new
                {
                    token,
                    user = new
                    {
                        user.Id,
                        user.Name,
                        user.Email,
                        user.Role,
                        user.ProfileImage,
                        user.Github,
                        user.Linkedin,
                        user.Education
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception occurred during user login: {Email}", dto.Email);
                return StatusCode(500, new { message = "An internal server error occurred." });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            _logger.LogInformation("User logged out: {Email}", email);
            return Ok(new { message = "Logged out successfully." });
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var name = User.FindFirst(ClaimTypes.Name)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            return Ok(new { id = userId, name, email, role });
        }
    }
}
