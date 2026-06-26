using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using JobPrepPortal.Data;
using JobPrepPortal.Models;
using JobPrepPortal.Repositories.Interfaces;

namespace JobPrepPortal.Repositories.Implementations
{
    public class ChatRepository : IChatRepository
    {
        private readonly ApplicationDbContext _context;

        public ChatRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ChatSession?> GetSessionByIdAsync(int sessionId)
        {
            return await _context.ChatSessions
                .Include(s => s.Messages)
                .FirstOrDefaultAsync(s => s.Id == sessionId);
        }

        public async Task<IEnumerable<ChatSession>> GetUserSessionsAsync(int userId)
        {
            return await _context.ChatSessions
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.CreatedDate)
                .ToListAsync();
        }

        public async Task<ChatSession> CreateSessionAsync(ChatSession session)
        {
            await _context.ChatSessions.AddAsync(session);
            await _context.SaveChangesAsync();
            return session;
        }

        public async Task DeleteSessionAsync(int sessionId)
        {
            var session = await _context.ChatSessions.FindAsync(sessionId);
            if (session != null)
            {
                _context.ChatSessions.Remove(session);
                await _context.SaveChangesAsync();
            }
        }

        public async Task AddMessageAsync(ChatMessage message)
        {
            await _context.ChatMessages.AddAsync(message);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ChatMessage>> GetSessionMessagesAsync(int sessionId)
        {
            return await _context.ChatMessages
                .Where(m => m.ChatSessionId == sessionId)
                .OrderBy(m => m.Timestamp)
                .ToListAsync();
        }

        public async Task<IEnumerable<ChatMessage>> SearchMessagesAsync(int userId, string query)
        {
            return await _context.ChatMessages
                .Include(m => m.ChatSession)
                .Where(m => m.ChatSession.UserId == userId && m.Message.Contains(query))
                .OrderByDescending(m => m.Timestamp)
                .ToListAsync();
        }
    }
}
