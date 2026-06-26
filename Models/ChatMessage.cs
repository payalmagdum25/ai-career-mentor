using System;
using System.ComponentModel.DataAnnotations;

namespace JobPrepPortal.Models
{
    public class ChatMessage
    {
        public int Id { get; set; }

        public int ChatSessionId { get; set; }
        public ChatSession ChatSession { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string Sender { get; set; } = "User"; // User, AI

        [Required]
        public string Message { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
