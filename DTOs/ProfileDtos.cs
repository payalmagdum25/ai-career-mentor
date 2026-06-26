using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace JobPrepPortal.DTOs
{
    public class ProfileUpdateDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Phone]
        public string? Phone { get; set; }

        public string? Github { get; set; }

        public string? Linkedin { get; set; }

        public string? Education { get; set; }

        public List<string> Skills { get; set; } = new List<string>();
    }
}
