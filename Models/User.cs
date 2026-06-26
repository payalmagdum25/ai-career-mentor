using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace JobPrepPortal.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(200)]
        public string Email { get; set; } = string.Empty;

        [StringLength(50)]
        public string? Phone { get; set; }

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public string? ProfileImage { get; set; }

        public string? Github { get; set; }

        public string? Linkedin { get; set; }

        public string? Education { get; set; }

        [Required]
        [StringLength(50)]
        public string Role { get; set; } = "Student"; // Student, Mentor, Admin

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<UserSkill> UserSkills { get; set; } = new List<UserSkill>();
        public ICollection<ResumeAnalysis> ResumeAnalyses { get; set; } = new List<ResumeAnalysis>();
        public ICollection<ChatSession> ChatSessions { get; set; } = new List<ChatSession>();
        public ICollection<CodeSubmission> CodeSubmissions { get; set; } = new List<CodeSubmission>();
        public ICollection<LearningRoadmap> LearningRoadmaps { get; set; } = new List<LearningRoadmap>();
        public ICollection<JobRecommendation> JobRecommendations { get; set; } = new List<JobRecommendation>();
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        public ICollection<InterviewSession> InterviewSessions { get; set; } = new List<InterviewSession>();
    }
}
