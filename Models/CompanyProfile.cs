using System.ComponentModel.DataAnnotations;

namespace JobPrepPortal.Models
{
    public class CompanyProfile
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        public string? LogoUrl { get; set; }

        public string? ExamPattern { get; set; }

        public string? Syllabus { get; set; }

        public string? Eligibility { get; set; }

        public string? HiringProcess { get; set; }
    }

    public class DsaProblem
    {
        public int Id { get; set; }

        [Required]
        public string Topic { get; set; } // Arrays, Linked List, etc.

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        public string? Link { get; set; }

        public string? Difficulty { get; set; } // Easy, Medium, Hard
    }
}
