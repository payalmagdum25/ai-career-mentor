using System.ComponentModel.DataAnnotations;

namespace JobPrepPortal.Models
{
    public class Job
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [Required]
        [StringLength(200)]
        public string Company { get; set; }

        public string? Location { get; set; }

        public string? Salary { get; set; }

        public string? Description { get; set; }

        public string? Type { get; set; } // Full-time, Part-time, Internship

        public DateTime PostedDate { get; set; } = DateTime.Now;

        public string? ApplicationUrl { get; set; }
    }
}
