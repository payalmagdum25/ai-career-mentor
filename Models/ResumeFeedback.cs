using System.ComponentModel.DataAnnotations;

namespace JobPrepPortal.Models
{
    public class ResumeFeedback
    {
        public int Id { get; set; }

        public int ResumeAnalysisId { get; set; }
        public ResumeAnalysis ResumeAnalysis { get; set; } = null!;

        [Required]
        [StringLength(100)]
        public string Category { get; set; } = string.Empty; // Keywords, Formatting, Grammar, Structure

        [Required]
        public string Suggestion { get; set; } = string.Empty;
    }
}
