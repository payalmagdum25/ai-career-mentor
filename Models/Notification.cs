using System;
using System.ComponentModel.DataAnnotations;

namespace JobPrepPortal.Models
{
    public class Notification
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } = string.Empty;

        public bool IsRead { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
