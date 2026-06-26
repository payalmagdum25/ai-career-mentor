using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace JobPrepPortal.Models
{
    public class CodingProblem
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Difficulty { get; set; } = "Easy"; // Easy, Medium, Hard

        [Required]
        public string Description { get; set; } = string.Empty;

        public string? ExampleInput { get; set; }

        public string? ExampleOutput { get; set; }

        // Navigation properties
        public ICollection<CodeSubmission> Submissions { get; set; } = new List<CodeSubmission>();
    }
}
