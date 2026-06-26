using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JobPrepPortal.Models;
using JobPrepPortal.Services.Interfaces;

namespace JobPrepPortal.Services.Implementations
{
    public class RuleBasedAIService : IAIService
    {
        public Task<string> GenerateChatResponseAsync(IEnumerable<ChatMessage> history, string userMessage)
        {
            var msg = userMessage.ToLower();
            string response;

            if (msg.Contains("hello") || msg.Contains("hi ") || msg.Equals("hi"))
            {
                response = "Hello! I am your AI Career Mentor. I can help you with Resume Analysis, Mock Interviews, Coding Practice, and generating a customized Learning Roadmap. How can I help you today?";
            }
            else if (msg.Contains("resume"))
            {
                response = "To analyze your resume, navigate to the **Resume Analyzer** page on the sidebar. Upload your PDF or DOCX file, and I will parse it, give you an ATS score, and offer suggestions to improve your keywords and format.";
            }
            else if (msg.Contains("interview"))
            {
                response = "Ready to practice? Go to the **Interview Practice** section on your dashboard. Select your technology (React, ASP.NET Core, Java, etc.) and I will ask you typical technical questions and grade your responses.";
            }
            else if (msg.Contains("code") || msg.Contains("dsa") || msg.Contains("leetcode"))
            {
                response = "Coding is key! You can visit the **Coding Practice** section to solve algorithm problems. You can write, run, and submit code directly inside our online editor.";
            }
            else if (msg.Contains("jobs") || msg.Contains("recommend"))
            {
                response = "I can matches your skills with current vacancies. Go to the **Job Recommendation** tab, configure your experience, and I will recommend matched opportunities!";
            }
            else if (msg.Contains("roadmap"))
            {
                response = "To create a structured plan, visit the **Learning Roadmap** section. You can set daily tasks, track weekly objectives, and monitor your monthly progress bar.";
            }
            else if (msg.Contains("react"))
            {
                response = "React is a powerful frontend library. To stand out, master functional components, hooks (useState, useEffect, useContext, useMemo), state management (Redux Toolkit, Zustand), and performance optimization like lazy loading and memoization.";
            }
            else if (msg.Contains("net") || msg.Contains("c#") || msg.Contains("asp"))
            {
                response = "For C# & ASP.NET Core development, make sure you understand Dependency Injection, Entity Framework Core, Web API routing, JWT Authentication, Repository Pattern, and Clean Architecture principles.";
            }
            else
            {
                response = "That is a great career query! To help you achieve this, I recommend setting up a daily learning habit. Master 1-2 core technical skills, solve at least one DSA challenge daily, and keep your resume optimized for ATS algorithms. Let me know if you want me to generate specific preparation questions or roadmap tasks!";
            }

            return Task.FromResult(response);
        }

        public Task<(int Score, IEnumerable<ResumeFeedback> Feedbacks)> AnalyzeResumeAsync(string fileName, string resumeText)
        {
            int score = 65; // Base score
            var feedbacks = new List<ResumeFeedback>();

            // Keywords check
            var keywords = new[] { "React", "ASP.NET", "SQL", "Database", "Git", "API", "Agile", "Cloud" };
            int matchedCount = 0;
            foreach (var kw in keywords)
            {
                if (resumeText.Contains(kw, StringComparison.OrdinalIgnoreCase))
                {
                    matchedCount++;
                }
            }

            score += matchedCount * 4;

            // Structure check
            bool hasEducation = resumeText.Contains("Education", StringComparison.OrdinalIgnoreCase) || resumeText.Contains("University", StringComparison.OrdinalIgnoreCase);
            bool hasExperience = resumeText.Contains("Experience", StringComparison.OrdinalIgnoreCase) || resumeText.Contains("Work", StringComparison.OrdinalIgnoreCase);
            bool hasProjects = resumeText.Contains("Projects", StringComparison.OrdinalIgnoreCase) || resumeText.Contains("Personal", StringComparison.OrdinalIgnoreCase);

            if (hasEducation) score += 5;
            else feedbacks.Add(new ResumeFeedback { Category = "Structure", Suggestion = "Missing a distinct 'Education' section. Ensure your academic credentials are clear." });

            if (hasExperience) score += 10;
            else feedbacks.Add(new ResumeFeedback { Category = "Structure", Suggestion = "Missing a 'Work Experience' or 'Internships' section. Focus on achievements rather than duties." });

            if (hasProjects) score += 5;
            else feedbacks.Add(new ResumeFeedback { Category = "Structure", Suggestion = "Add a 'Projects' section to showcase practical coding knowledge and open-source contributions." });

            if (matchedCount < 4)
            {
                feedbacks.Add(new ResumeFeedback { Category = "Keywords", Suggestion = "Keyword density is low. Add relevant tech stack terms like 'REST APIs', 'SQL Server', and specific libraries." });
            }
            else
            {
                feedbacks.Add(new ResumeFeedback { Category = "Keywords", Suggestion = "Good keyword alignment! Consider adding metrics (e.g. 'Improved speed by 20%') to strengthen statements." });
            }

            if (fileName.EndsWith(".docx", StringComparison.OrdinalIgnoreCase))
            {
                score += 2;
                feedbacks.Add(new ResumeFeedback { Category = "Formatting", Suggestion = "Ensure your formatting remains consistent when exporting to PDF. PDF is generally preferred for upload." });
            }
            else if (fileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
            {
                score += 5;
                feedbacks.Add(new ResumeFeedback { Category = "Formatting", Suggestion = "PDF format detected. Perfect for preserving fonts and structure." });
            }

            score = Math.Min(score, 100);

            return Task.FromResult((score, feedbacks.AsEnumerable()));
        }

        public Task<IEnumerable<string>> GenerateInterviewQuestionsAsync(string technology, int count = 5)
        {
            var questions = new List<string>();
            var tech = technology.ToLower();

            if (tech.Contains("react"))
            {
                questions.AddRange(new[]
                {
                    "What is the difference between Virtual DOM and Real DOM in React?",
                    "Explain React lifecycle methods and how they compare with useEffect Hook.",
                    "How does state management work in React, and when would you use Redux vs Context API?",
                    "What is reconciliation, and why are keys important in React Lists?",
                    "Explain how you can optimize performance in a heavy React application."
                });
            }
            else if (tech.Contains("net") || tech.Contains("c#"))
            {
                questions.AddRange(new[]
                {
                    "What is Dependency Injection in ASP.NET Core, and what are the transient, scoped, and singleton lifetimes?",
                    "Explain the Repository Pattern and why it is useful in EF Core applications.",
                    "What is the difference between IQueryable and IEnumerable in C#?",
                    "Explain JWT Token authentication and how refresh tokens secure Web APIs.",
                    "What are middlewares in ASP.NET Core, and how do they function in the HTTP pipeline?"
                });
            }
            else if (tech.Contains("sql") || tech.Contains("database"))
            {
                questions.AddRange(new[]
                {
                    "What is database normalization, and explain 1NF, 2NF, and 3NF.",
                    "What is the difference between a clustered and non-clustered index?",
                    "Explain Joins (Inner, Left, Right, Full) and their performance implications.",
                    "What are transactions, and what does ACID stand for?",
                    "How do you optimize a slow-running SQL query?"
                });
            }
            else
            {
                questions.AddRange(new[]
                {
                    "What is polymorphism, and how is it implemented in your favorite programming language?",
                    "Explain the difference between a process and a thread.",
                    "How does git merge differ from git rebase?",
                    "What are REST APIs, and what are the standard HTTP methods?",
                    "Explain the time and space complexity of Quick Sort."
                });
            }

            return Task.FromResult(questions.Take(count));
        }

        public Task<(int Score, string FeedbackText)> EvaluateInterviewAnswerAsync(string question, string answer)
        {
            var ans = answer.ToLower();
            int score = 50; // base score
            string feedback;

            if (string.IsNullOrWhiteSpace(answer) || answer.Length < 10)
            {
                return Task.FromResult((20, "Answer is too short or empty. Please provide a detailed response to show technical expertise."));
            }

            // Keyword analysis to rate accuracy
            if (question.Contains("Virtual DOM", StringComparison.OrdinalIgnoreCase))
            {
                bool referencesDiff = ans.Contains("diff") || ans.Contains("reconcil");
                bool referencesMemory = ans.Contains("memory") || ans.Contains("lightweight");
                bool referencesUpdates = ans.Contains("update") || ans.Contains("fast");

                if (referencesDiff) score += 15;
                if (referencesMemory) score += 15;
                if (referencesUpdates) score += 15;

                feedback = score > 75 
                    ? "Excellent! You explained that the Virtual DOM is a lightweight memory representation that updates efficiently through diffing/reconciliation."
                    : "Good start, but make sure to mention that React diffs the Virtual DOM with the Real DOM to perform batch updates for better speed.";
            }
            else if (question.Contains("Dependency Injection", StringComparison.OrdinalIgnoreCase))
            {
                bool hasTransient = ans.Contains("transient");
                bool hasScoped = ans.Contains("scoped");
                bool hasSingleton = ans.Contains("singleton");

                if (hasTransient) score += 15;
                if (hasScoped) score += 15;
                if (hasSingleton) score += 15;

                feedback = score > 80
                    ? "Perfect. You named all three lifetimes (Transient, Scoped, Singleton) and explained their scope and instances correctly."
                    : "Partial explanation. Be sure to detail the differences: Transient (new every time), Scoped (once per request), and Singleton (single instance).";
            }
            else
            {
                // General evaluation based on depth of content
                if (ans.Length > 200) score += 25;
                else if (ans.Length > 100) score += 15;
                else score += 5;

                if (ans.Contains("because") || ans.Contains("example") || ans.Contains("use case"))
                {
                    score += 10;
                }

                feedback = score >= 80 
                    ? "Great explanation with good logical structure and vocabulary."
                    : "Your response is decent but could be improved. Try adding concrete examples or practical use cases from your projects.";
            }

            score = Math.Min(score, 100);
            return Task.FromResult((score, feedback));
        }

        public Task<IEnumerable<JobRecommendation>> RecommendJobsAsync(int userId, IEnumerable<string> skills, string? location)
        {
            var list = new List<JobRecommendation>();
            var skillsList = skills.Select(s => s.ToLower()).ToList();

            // Simulate recommended jobs based on skills
            if (skillsList.Contains("react") || skillsList.Contains("javascript") || skillsList.Contains("frontend"))
            {
                list.Add(new JobRecommendation
                {
                    UserId = userId,
                    Company = "Microsoft",
                    Position = "Frontend Engineer - React",
                    Location = location ?? "Redmond, WA",
                    MatchPercentage = 95
                });
                list.Add(new JobRecommendation
                {
                    UserId = userId,
                    Company = "Netflix",
                    Position = "UI Engineer",
                    Location = "Los Gatos, CA",
                    MatchPercentage = 88
                });
            }

            if (skillsList.Contains(".net") || skillsList.Contains("c#") || skillsList.Contains("asp.net"))
            {
                list.Add(new JobRecommendation
                {
                    UserId = userId,
                    Company = "Google",
                    Position = "Software Engineer - Cloud Systems",
                    Location = "Mountain View, CA",
                    MatchPercentage = 90
                });
                list.Add(new JobRecommendation
                {
                    UserId = userId,
                    Company = "Oracle",
                    Position = "Enterprise Developer",
                    Location = location ?? "Austin, TX",
                    MatchPercentage = 85
                });
            }

            // Fallback job
            list.Add(new JobRecommendation
            {
                UserId = userId,
                Company = "Amazon",
                Position = "Software Development Engineer (SDE I)",
                Location = location ?? "Seattle, WA",
                MatchPercentage = 80
            });

            return Task.FromResult(list.AsEnumerable());
        }

        public Task<IEnumerable<LearningRoadmap>> GenerateRoadmapAsync(int userId, string targetRole, IEnumerable<string> targetSkills)
        {
            var roadmaps = new List<LearningRoadmap>();
            var now = DateTime.UtcNow;

            roadmaps.Add(new LearningRoadmap
            {
                UserId = userId,
                Task = $"Research the fundamentals of {targetRole} and map out critical tools.",
                Period = "Daily",
                TargetDate = now.AddDays(1),
                Completed = false
            });

            roadmaps.Add(new LearningRoadmap
            {
                UserId = userId,
                Task = $"Complete a mini-project applying {string.Join(", ", targetSkills.Take(2))}.",
                Period = "Daily",
                TargetDate = now.AddDays(3),
                Completed = false
            });

            roadmaps.Add(new LearningRoadmap
            {
                UserId = userId,
                Task = "Refactor personal GitHub repos to use clean architecture and write a README.",
                Period = "Weekly",
                TargetDate = now.AddDays(7),
                Completed = false
            });

            roadmaps.Add(new LearningRoadmap
            {
                UserId = userId,
                Task = "Submit 5 LeetCode Medium challenges covering Arrays and Strings.",
                Period = "Weekly",
                TargetDate = now.AddDays(14),
                Completed = false
            });

            roadmaps.Add(new LearningRoadmap
            {
                UserId = userId,
                Task = "Perform a mock interview simulation on our AI Career Mentor platform.",
                Period = "Monthly",
                TargetDate = now.AddDays(30),
                Completed = false
            });

            return Task.FromResult(roadmaps.AsEnumerable());
        }

        public Task<string> GetCareerGuidanceAsync(string education, IEnumerable<string> skills)
        {
            var response = $"With your educational background in {education} and skills in {string.Join(", ", skills)}, you have a solid platform. " +
                           "To secure an internship or junior developer role at tier-1 firms like Google or Microsoft, focus on: " +
                           "1. Solving 150+ DSA problems covering Trees, Graphs, and Dynamic Programming. " +
                           "2. Developing a complex project showcasing Web API endpoints, database normalization, and structured frontend components. " +
                           "3. Honing your system design knowledge, specifically caching, database scaling, and microservices architecture.";

            return Task.FromResult(response);
        }
    }
}
