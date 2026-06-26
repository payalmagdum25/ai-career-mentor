using System.ComponentModel.DataAnnotations;

namespace JobPrepPortal.Models
{
    public class InterviewQuestion
    {
        public int Id { get; set; }

        public int InterviewSessionId { get; set; }
        public InterviewSession InterviewSession { get; set; } = null!;

        [Required]
        public string QuestionText { get; set; } = string.Empty;

        public string? UserAnswer { get; set; }

        public string? Feedback { get; set; }

        public int Score { get; set; }
    }
}
