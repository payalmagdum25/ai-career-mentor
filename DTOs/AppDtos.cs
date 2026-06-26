using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace JobPrepPortal.DTOs
{
    // Chat DTOs
    public class ChatCreateDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = "New Chat";
    }

    public class MessageSendDto
    {
        [Required]
        public string MessageText { get; set; } = string.Empty;
    }

    // Interview DTOs
    public class InterviewStartDto
    {
        [Required]
        [StringLength(100)]
        public string Technology { get; set; } = string.Empty;
    }

    public class AnswerSubmitDto
    {
        [Required]
        public int QuestionId { get; set; }

        [Required]
        public string Answer { get; set; } = string.Empty;
    }

    // Code DTOs
    public class CodeRunDto
    {
        [Required]
        public int ProblemId { get; set; }

        [Required]
        public string Language { get; set; } = "JavaScript";

        [Required]
        public string Code { get; set; } = string.Empty;
    }

    // Roadmap DTOs
    public class RoadmapGenerateDto
    {
        [Required]
        [StringLength(200)]
        public string TargetRole { get; set; } = string.Empty;

        [Required]
        public List<string> TargetSkills { get; set; } = new List<string>();
    }
}
