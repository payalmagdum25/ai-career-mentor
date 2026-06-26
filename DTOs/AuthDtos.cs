using System.ComponentModel.DataAnnotations;

namespace JobPrepPortal.DTOs
{
    public class RegisterDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(200)]
        public string Email { get; set; } = string.Empty;

        [Phone]
        public string? Phone { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = "Student"; // Student, Mentor, Admin
    }

    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
        
        public bool RememberMe { get; set; }
    }
}
