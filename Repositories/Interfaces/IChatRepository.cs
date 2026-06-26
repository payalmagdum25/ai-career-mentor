using System.Collections.Generic;
using System.Threading.Tasks;
using JobPrepPortal.Models;

namespace JobPrepPortal.Repositories.Interfaces
{
    public interface IChatRepository
    {
        Task<ChatSession?> GetSessionByIdAsync(int sessionId);
        Task<IEnumerable<ChatSession>> GetUserSessionsAsync(int userId);
        Task<ChatSession> CreateSessionAsync(ChatSession session);
        Task DeleteSessionAsync(int sessionId);
        Task AddMessageAsync(ChatMessage message);
        Task<IEnumerable<ChatMessage>> GetSessionMessagesAsync(int sessionId);
        Task<IEnumerable<ChatMessage>> SearchMessagesAsync(int userId, string query);
    }
}
