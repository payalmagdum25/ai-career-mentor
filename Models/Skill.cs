using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace JobPrepPortal.Models
{
    public class Skill
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string SkillName { get; set; } = string.Empty;

        // Navigation properties
        public ICollection<UserSkill> UserSkills { get; set; } = new List<UserSkill>();
    }
}
