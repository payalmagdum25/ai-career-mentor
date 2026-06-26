using System.Collections.Generic;
using System.Threading.Tasks;
using JobPrepPortal.Models;

namespace JobPrepPortal.Services.Interfaces
{
    public interface IChatService
    {
        Task<ChatSession> CreateSessionAsync(int userId, string title);
        Task<IEnumerable<ChatSession>> GetUserSessionsAsync(int userId);
        Task<ChatSession?> GetSessionByIdAsync(int sessionId);
        Task<ChatMessage> SendMessageAsync(int sessionId, string messageText, string sender);
        Task DeleteSessionAsync(int sessionId);
        Task<IEnumerable<ChatMessage>> SearchHistoryAsync(int userId, string query);
    }
}
