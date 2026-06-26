using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using JobPrepPortal.Models;
using JobPrepPortal.Repositories.Interfaces;
using JobPrepPortal.Services.Interfaces;

namespace JobPrepPortal.Services.Implementations
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository _chatRepository;
        private readonly IAIService _aiService;
        private readonly ILogger<ChatService> _logger;

        public ChatService(IChatRepository chatRepository, IAIService aiService, ILogger<ChatService> logger)
        {
            _chatRepository = chatRepository;
            _aiService = aiService;
            _logger = logger;
        }

        public async Task<ChatSession> CreateSessionAsync(int userId, string title)
        {
            _logger.LogInformation("Creating new chat session for user {UserId} with title: {Title}", userId, title);
            var session = new ChatSession
            {
                UserId = userId,
                Title = title,
                CreatedDate = DateTime.UtcNow
            };
            return await _chatRepository.CreateSessionAsync(session);
        }

        public async Task<IEnumerable<ChatSession>> GetUserSessionsAsync(int userId)
        {
            return await _chatRepository.GetUserSessionsAsync(userId);
        }

        public async Task<ChatSession?> GetSessionByIdAsync(int sessionId)
        {
            return await _chatRepository.GetSessionByIdAsync(sessionId);
        }

        public async Task<ChatMessage> SendMessageAsync(int sessionId, string messageText, string sender)
        {
            _logger.LogInformation("Sending message from {Sender} in session {SessionId}", sender, sessionId);

            // 1. Add user message
            var userMsg = new ChatMessage
            {
                ChatSessionId = sessionId,
                Sender = sender,
                Message = messageText,
                Timestamp = DateTime.UtcNow
            };
            await _chatRepository.AddMessageAsync(userMsg);

            if (sender.Equals("User", StringComparison.OrdinalIgnoreCase))
            {
                // 2. Fetch session history
                var messages = await _chatRepository.GetSessionMessagesAsync(sessionId);

                // 3. Generate AI response
                var aiResponseText = await _aiService.GenerateChatResponseAsync(messages, messageText);

                var aiMsg = new ChatMessage
                {
                    ChatSessionId = sessionId,
                    Sender = "AI",
                    Message = aiResponseText,
                    Timestamp = DateTime.UtcNow
                };

                await _chatRepository.AddMessageAsync(aiMsg);
                return aiMsg;
            }

            return userMsg;
        }

        public async Task DeleteSessionAsync(int sessionId)
        {
            _logger.LogInformation("Deleting chat session: {SessionId}", sessionId);
            await _chatRepository.DeleteSessionAsync(sessionId);
        }

        public async Task<IEnumerable<ChatMessage>> SearchHistoryAsync(int userId, string query)
        {
            _logger.LogInformation("Searching chat history for user {UserId} with query: {Query}", userId, query);
            return await _chatRepository.SearchMessagesAsync(userId, query);
        }
    }
}
