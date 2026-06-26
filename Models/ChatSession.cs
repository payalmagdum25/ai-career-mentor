using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace JobPrepPortal.Models
{
    public class ChatSession
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        [Required]
        [StringLength(250)]
        public string Title { get; set; } = "New Chat";

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<ChatMessage> Messages { get; set; } = new List<ChatMessage>();
    }
}
