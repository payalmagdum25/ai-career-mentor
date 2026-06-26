using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace JobPrepPortal.Models
{
    public class InterviewSession
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        [Required]
        [StringLength(100)]
        public string Technology { get; set; } = string.Empty;

        public int Score { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<InterviewQuestion> Questions { get; set; } = new List<InterviewQuestion>();
    }
}
