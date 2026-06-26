using System.ComponentModel.DataAnnotations;

namespace JobPrepPortal.Models
{
    public class PrepMaterial
    {
        public int Id { get; set; }

        [Required]
        public string Category { get; set; } // Aptitude, DSA, Technical, HR

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        public string? Content { get; set; }

        public string? Difficulty { get; set; } // Easy, Medium, Hard

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public ICollection<PracticeProblem> PracticeProblems { get; set; } = new List<PracticeProblem>();
    }

    public class PracticeProblem
    {
        public int Id { get; set; }

        public int PrepMaterialId { get; set; }

        public string? ProblemTitle { get; set; }

        public string? ProblemDescription { get; set; }

        public string? Solution { get; set; }

        public PrepMaterial PrepMaterial { get; set; }
    }
}
