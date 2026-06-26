using System.Collections.Generic;
using System.Threading.Tasks;
using JobPrepPortal.Models;

namespace JobPrepPortal.Services.Interfaces
{
    public interface IAIService
    {
        Task<string> GenerateChatResponseAsync(IEnumerable<ChatMessage> history, string userMessage);
        
        Task<(int Score, IEnumerable<ResumeFeedback> Feedbacks)> AnalyzeResumeAsync(string fileName, string resumeText);
        
        Task<IEnumerable<string>> GenerateInterviewQuestionsAsync(string technology, int count = 5);
        
        Task<(int Score, string FeedbackText)> EvaluateInterviewAnswerAsync(string question, string answer);
        
        Task<IEnumerable<JobRecommendation>> RecommendJobsAsync(int userId, IEnumerable<string> skills, string? location);
        
        Task<IEnumerable<LearningRoadmap>> GenerateRoadmapAsync(int userId, string targetRole, IEnumerable<string> targetSkills);
        
        Task<string> GetCareerGuidanceAsync(string education, IEnumerable<string> skills);
    }
}
