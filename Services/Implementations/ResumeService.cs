using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using JobPrepPortal.Models;
using JobPrepPortal.Repositories.Interfaces;
using JobPrepPortal.Services.Interfaces;

namespace JobPrepPortal.Services.Implementations
{
    public class ResumeService : IResumeService
    {
        private readonly IResumeRepository _resumeRepository;
        private readonly IAIService _aiService;
        private readonly ILogger<ResumeService> _logger;

        public ResumeService(IResumeRepository resumeRepository, IAIService aiService, ILogger<ResumeService> logger)
        {
            _resumeRepository = resumeRepository;
            _aiService = aiService;
            _logger = logger;
        }

        public async Task<ResumeAnalysis> AnalyzeResumeAsync(int userId, string fileName, Stream fileStream)
        {
            _logger.LogInformation("Starting resume analysis for user {UserId}, file: {FileName}", userId, fileName);

            // Read some sample content from stream to simulate parsing
            string parsedText = "";
            try
            {
                using (var reader = new StreamReader(fileStream, Encoding.UTF8, detectEncodingFromByteOrderMarks: true, bufferSize: 1024, leaveOpen: true))
                {
                    var buffer = new char[500];
                    int readBytes = await reader.ReadBlockAsync(buffer, 0, 500);
                    parsedText = new string(buffer, 0, readBytes);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to read file stream. Using default analysis template.");
                parsedText = "React Developer with experience in SQL Server, ASP.NET Core, and Git.";
            }

            if (string.IsNullOrWhiteSpace(parsedText))
            {
                parsedText = "React Developer with experience in SQL Server, ASP.NET Core, and Git.";
            }

            // Call the AI Service
            var (score, feedbacks) = await _aiService.AnalyzeResumeAsync(fileName, parsedText);

            var analysis = new ResumeAnalysis
            {
                UserId = userId,
                FileName = fileName,
                ResumeScore = score,
                CreatedDate = DateTime.UtcNow
            };

            var savedAnalysis = await _resumeRepository.CreateAsync(analysis);

            var feedbackItems = new List<ResumeFeedback>();
            foreach (var f in feedbacks)
            {
                feedbackItems.Add(new ResumeFeedback
                {
                    ResumeAnalysisId = savedAnalysis.Id,
                    Category = f.Category,
                    Suggestion = f.Suggestion
                });
            }

            await _resumeRepository.AddFeedbackAsync(feedbackItems);
            _logger.LogInformation("Resume analysis complete. Session ID: {Id}, Score: {Score}", savedAnalysis.Id, score);

            return savedAnalysis;
        }

        public async Task<ResumeAnalysis?> GetAnalysisByIdAsync(int id)
        {
            return await _resumeRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<ResumeAnalysis>> GetUserAnalysesAsync(int userId)
        {
            return await _resumeRepository.GetUserAnalysesAsync(userId);
        }
    }
}
