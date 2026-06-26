using System;
using System.ComponentModel.DataAnnotations;

namespace JobPrepPortal.Models
{
    public class LearningRoadmap
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        [Required]
        [StringLength(250)]
        public string Task { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Period { get; set; } = "Daily"; // Daily, Weekly, Monthly

        public DateTime TargetDate { get; set; }

        public bool Completed { get; set; }
    }
}
