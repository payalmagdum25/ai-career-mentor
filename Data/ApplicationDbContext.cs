using Microsoft.EntityFrameworkCore;
using JobPrepPortal.Models;

namespace JobPrepPortal.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Job> Jobs { get; set; }
        public DbSet<PrepMaterial> PrepMaterials { get; set; }
        public DbSet<PracticeProblem> PracticeProblems { get; set; }
        public DbSet<CompanyProfile> CompanyProfiles { get; set; }
        public DbSet<DsaProblem> DsaProblems { get; set; }

        // New normalized database tables
        public DbSet<User> Users { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<UserSkill> UserSkills { get; set; }
        public DbSet<ResumeAnalysis> ResumeAnalyses { get; set; }
        public DbSet<ResumeFeedback> ResumeFeedbacks { get; set; }
        public DbSet<ChatSession> ChatSessions { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<InterviewSession> InterviewSessions { get; set; }
        public DbSet<InterviewQuestion> InterviewQuestions { get; set; }
        public DbSet<CodingProblem> CodingProblems { get; set; }
        public DbSet<CodeSubmission> CodeSubmissions { get; set; }
        public DbSet<LearningRoadmap> LearningRoadmaps { get; set; }
        public DbSet<JobRecommendation> JobRecommendations { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Practice problem to PrepMaterial relationship
            modelBuilder.Entity<PracticeProblem>()
                .HasOne(p => p.PrepMaterial)
                .WithMany(m => m.PracticeProblems)
                .HasForeignKey(p => p.PrepMaterialId)
                .OnDelete(DeleteBehavior.Cascade);

            // UserSkill Composite Primary Key
            modelBuilder.Entity<UserSkill>()
                .HasKey(us => new { us.UserId, us.SkillId });

            modelBuilder.Entity<UserSkill>()
                .HasOne(us => us.User)
                .WithMany(u => u.UserSkills)
                .HasForeignKey(us => us.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserSkill>()
                .HasOne(us => us.Skill)
                .WithMany(s => s.UserSkills)
                .HasForeignKey(us => us.SkillId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Delete Behaviors to avoid cycle issues
            modelBuilder.Entity<ResumeAnalysis>()
                .HasOne(ra => ra.User)
                .WithMany(u => u.ResumeAnalyses)
                .HasForeignKey(ra => ra.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ResumeFeedback>()
                .HasOne(rf => rf.ResumeAnalysis)
                .WithMany(ra => ra.Feedbacks)
                .HasForeignKey(rf => rf.ResumeAnalysisId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ChatSession>()
                .HasOne(cs => cs.User)
                .WithMany(u => u.ChatSessions)
                .HasForeignKey(cs => cs.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ChatMessage>()
                .HasOne(cm => cm.ChatSession)
                .WithMany(cs => cs.Messages)
                .HasForeignKey(cm => cm.ChatSessionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<InterviewSession>()
                .HasOne(isess => isess.User)
                .WithMany(u => u.InterviewSessions)
                .HasForeignKey(isess => isess.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<InterviewQuestion>()
                .HasOne(iq => iq.InterviewSession)
                .WithMany(isess => isess.Questions)
                .HasForeignKey(iq => iq.InterviewSessionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CodeSubmission>()
                .HasOne(cs => cs.User)
                .WithMany(u => u.CodeSubmissions)
                .HasForeignKey(cs => cs.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CodeSubmission>()
                .HasOne(cs => cs.CodingProblem)
                .WithMany(cp => cp.Submissions)
                .HasForeignKey(cs => cs.CodingProblemId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<LearningRoadmap>()
                .HasOne(lr => lr.User)
                .WithMany(u => u.LearningRoadmaps)
                .HasForeignKey(lr => lr.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<JobRecommendation>()
                .HasOne(jr => jr.User)
                .WithMany(u => u.JobRecommendations)
                .HasForeignKey(jr => jr.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
