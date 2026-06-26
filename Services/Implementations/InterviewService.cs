using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using JobPrepPortal.Data;
using JobPrepPortal.Models;
using JobPrepPortal.Repositories.Interfaces;
using JobPrepPortal.Services.Interfaces;

namespace JobPrepPortal.Services.Implementations
{
    public class InterviewService : IInterviewService
    {
        private readonly IInterviewRepository _interviewRepository;
        private readonly IAIService _aiService;
        private readonly ApplicationDbContext _context; // Required to fetch individual questions quickly
        private readonly ILogger<InterviewService> _logger;

        public InterviewService(IInterviewRepository interviewRepository, IAIService aiService, ApplicationDbContext context, ILogger<InterviewService> logger)
        {
            _interviewRepository = interviewRepository;
            _aiService = aiService;
            _context = context;
            _logger = logger;
        }

        public async Task<InterviewSession> StartSessionAsync(int userId, string technology)
        {
            _logger.LogInformation("Starting new interview session for user {UserId} on technology {Tech}", userId, technology);

            var session = new InterviewSession
            {
                UserId = userId,
                Technology = technology,
                Score = 0,
                CreatedDate = DateTime.UtcNow
            };

            var createdSession = await _interviewRepository.CreateSessionAsync(session);

            // Fetch AI questions
            var questionsText = await _aiService.GenerateInterviewQuestionsAsync(technology, count: 5);
            var questions = questionsText.Select(q => new InterviewQuestion
            {
                InterviewSessionId = createdSession.Id,
                QuestionText = q,
                UserAnswer = string.Empty,
                Feedback = "Not answered yet.",
                Score = 0
            }).ToList();

            await _interviewRepository.AddQuestionsAsync(questions);

            return createdSession;
        }

        public async Task<InterviewSession?> GetSessionByIdAsync(int id)
        {
            return await _interviewRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<InterviewSession>> GetUserSessionsAsync(int userId)
        {
            return await _interviewRepository.GetUserSessionsAsync(userId);
        }

        public async Task<InterviewQuestion> SubmitAnswerAsync(int questionId, string answer)
        {
            _logger.LogInformation("Submitting answer for question ID {QuestionId}", questionId);
            var question = await _context.InterviewQuestions.FindAsync(questionId);
            if (question == null)
            {
                throw new Exception("Question not found.");
            }

            var (score, feedback) = await _aiService.EvaluateInterviewAnswerAsync(question.QuestionText, answer);

            question.UserAnswer = answer;
            question.Feedback = feedback;
            question.Score = score;

            await _interviewRepository.UpdateQuestionAsync(question);
            return question;
        }

        public async Task<int> CompleteSessionAsync(int sessionId)
        {
            _logger.LogInformation("Completing interview session ID {SessionId}", sessionId);
            var session = await _interviewRepository.GetByIdAsync(sessionId);
            if (session == null)
            {
                throw new Exception("Session not found.");
            }

            int overallScore = 0;
            if (session.Questions.Any())
            {
                overallScore = (int)session.Questions.Average(q => q.Score);
            }

            await _interviewRepository.UpdateSessionScoreAsync(sessionId, overallScore);

            // Create notification for student
            var notification = new Notification
            {
                UserId = session.UserId,
                Title = "Interview Prep Completed!",
                Message = $"You completed the {session.Technology} mock interview. Overall score: {overallScore}%. Review AI suggestions on the dashboard.",
                IsRead = false,
                CreatedDate = DateTime.UtcNow
            };
            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            return overallScore;
        }
    }
}
