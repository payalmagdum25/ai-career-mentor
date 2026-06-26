using System.ComponentModel.DataAnnotations;

namespace JobPrepPortal.Models
{
    public class JobRecommendation
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        [Required]
        [StringLength(200)]
        public string Company { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Position { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Location { get; set; }

        public int MatchPercentage { get; set; }
    }
}
