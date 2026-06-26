using System;
using System.ComponentModel.DataAnnotations;

namespace JobPrepPortal.Models
{
    public class CodeSubmission
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int CodingProblemId { get; set; }
        public CodingProblem CodingProblem { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string Language { get; set; } = "JavaScript";

        [Required]
        public string Code { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Result { get; set; } = "Pending"; // Accepted, Wrong Answer, Compile Error

        public DateTime SubmittedDate { get; set; } = DateTime.UtcNow;
    }
}
