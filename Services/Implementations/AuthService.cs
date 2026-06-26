using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net;
using JobPrepPortal.Models;
using JobPrepPortal.Repositories.Interfaces;
using JobPrepPortal.Services.Interfaces;

namespace JobPrepPortal.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(IUserRepository userRepository, IConfiguration configuration, ILogger<AuthService> logger)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<User?> RegisterAsync(string name, string email, string? phone, string password, string role)
        {
            _logger.LogInformation("Registering new user with email: {Email}", email);
            var existingUser = await _userRepository.GetByEmailAsync(email);
            if (existingUser != null)
            {
                _logger.LogWarning("Registration failed. User with email {Email} already exists.", email);
                throw new Exception("Email is already registered.");
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
            var user = new User
            {
                Name = name,
                Email = email,
                Phone = phone,
                PasswordHash = passwordHash,
                Role = role,
                CreatedAt = DateTime.UtcNow
            };

            var createdUser = await _userRepository.CreateAsync(user);
            _logger.LogInformation("User {Email} successfully registered with ID {Id}", email, createdUser.Id);

            // Add default welcome notification
            await _userRepository.AddNotificationAsync(new Notification
            {
                UserId = createdUser.Id,
                Title = "Welcome to AI Career Mentor!",
                Message = $"Hi {name}, upload your resume or start a mock interview to begin your career prep journey.",
                IsRead = false,
                CreatedDate = DateTime.UtcNow
            });

            return createdUser;
        }

        public async Task<(User? User, string? Token)> LoginAsync(string email, string password)
        {
            _logger.LogInformation("Attempting login for email: {Email}", email);
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                _logger.LogWarning("Login failed. User with email {Email} not found.", email);
                return (null, null);
            }

            if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                _logger.LogWarning("Login failed. Incorrect password for user {Email}.", email);
                return (null, null);
            }

            var token = GenerateJwtToken(user);
            _logger.LogInformation("User {Email} successfully authenticated. JWT generated.", email);

            return (user, token);
        }

        public string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtKey = _configuration["Jwt:Key"] ?? "SUPER_SECRET_KEY_FOR_AI_CAREER_MENTOR_WEB_APP_2026_SECURITY";
            var key = Encoding.ASCII.GetBytes(jwtKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = _configuration["Jwt:Issuer"] ?? "AICareerMentor",
                Audience = _configuration["Jwt:Audience"] ?? "AICareerMentorUsers",
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
