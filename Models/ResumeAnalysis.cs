using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace JobPrepPortal.Models
{
    public class ResumeAnalysis
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        [Required]
        [StringLength(250)]
        public string FileName { get; set; } = string.Empty;

        public int ResumeScore { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<ResumeFeedback> Feedbacks { get; set; } = new List<ResumeFeedback>();
    }
}
