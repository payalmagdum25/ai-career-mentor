using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JobPrepPortal.Data;

namespace JobPrepPortal.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var userId = GetCurrentUserId();

            // 1. Resume Score
            var latestResume = await _context.ResumeAnalyses
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedDate)
                .FirstOrDefaultAsync();
            int resumeScore = latestResume?.ResumeScore ?? 0;

            // 2. Interview Score
            var latestInterview = await _context.InterviewSessions
                .Where(i => i.UserId == userId)
                .OrderByDescending(i => i.CreatedDate)
                .FirstOrDefaultAsync();
            int interviewScore = latestInterview?.Score ?? 0;

            // 3. Learning Progress (percentage of completed roadmap tasks)
            var roadmapTasks = await _context.LearningRoadmaps
                .Where(r => r.UserId == userId)
                .ToListAsync();
            int learningProgress = 0;
            if (roadmapTasks.Any())
            {
                int completed = roadmapTasks.Count(r => r.Completed);
                learningProgress = (int)((double)completed / roadmapTasks.Count * 100);
            }

            // 4. Daily Streak (simulate or compute based on activity days)
            int dailyStreak = 5; // default portfolio value

            // 5. Recent Activity aggregation
            var recentActivities = new System.Collections.Generic.List<object>();

            var subms = await _context.CodeSubmissions
                .Include(s => s.CodingProblem)
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.SubmittedDate)
                .Take(3)
                .ToListAsync();

            foreach (var s in subms)
            {
                recentActivities.Add(new
                {
                    type = "Coding",
                    title = $"Submitted solution for {s.CodingProblem.Title}",
                    status = s.Result,
                    date = s.SubmittedDate
                });
            }

            var interviews = await _context.InterviewSessions
                .Where(i => i.UserId == userId)
                .OrderByDescending(i => i.CreatedDate)
                .Take(2)
                .ToListAsync();

            foreach (var i in interviews)
            {
                recentActivities.Add(new
                {
                    type = "Interview",
                    title = $"Completed {i.Technology} Mock Interview",
                    status = $"Score: {i.Score}%",
                    date = i.CreatedDate
                });
            }

            var resumes = await _context.ResumeAnalyses
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedDate)
                .Take(2)
                .ToListAsync();

            foreach (var r in resumes)
            {
                recentActivities.Add(new
                {
                    type = "Resume",
                    title = $"Analyzed Resume: {r.FileName}",
                    status = $"Score: {r.ResumeScore}/100",
                    date = r.CreatedDate
                });
            }

            // Order activities by date
            var sortedActivities = recentActivities
                .OrderByDescending(a => (DateTime)a.GetType().GetProperty("date")!.GetValue(a, null)!)
                .Take(5)
                .ToList();

            // 6. Upcoming Tasks (uncompleted roadmap items)
            var upcomingTasks = roadmapTasks
                .Where(t => !t.Completed)
                .OrderBy(t => t.TargetDate)
                .Take(4)
                .Select(t => new { t.Id, t.Task, t.Period, t.TargetDate })
                .ToList();

            // 7. Recent Chats
            var recentChats = await _context.ChatSessions
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.CreatedDate)
                .Take(3)
                .Select(c => new { c.Id, c.Title, c.CreatedDate })
                .ToListAsync();

            // 8. Unread Notifications Count
            var unreadNotificationsCount = await _context.Notifications
                .CountAsync(n => n.UserId == userId && !n.IsRead);

            // 9. Score Chart Data (Resume vs Interview scores over time)
            var interviewChart = await _context.InterviewSessions
                .Where(i => i.UserId == userId)
                .OrderBy(i => i.CreatedDate)
                .Take(6)
                .Select(i => new { label = i.Technology, score = i.Score })
                .ToListAsync();

            return Ok(new
            {
                resumeScore,
                interviewScore,
                learningProgress,
                dailyStreak,
                recentActivities = sortedActivities,
                upcomingTasks,
                recentChats,
                unreadNotificationsCount,
                chartData = interviewChart
            });
        }
    }
}
