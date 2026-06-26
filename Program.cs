using System;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using JobPrepPortal.Data;
using JobPrepPortal.Repositories.Interfaces;
using JobPrepPortal.Repositories.Implementations;
using JobPrepPortal.Services.Interfaces;
using JobPrepPortal.Services.Implementations;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddControllers(); // Required for Web API Attribute Routing

// Configure SQL Server Database Context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlServerOptionsAction: sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure();
        }));

// Enable CORS for React Dev Server
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "SUPER_SECRET_KEY_FOR_AI_CAREER_MENTOR_WEB_APP_2026_SECURITY";
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "AICareerMentor",
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"] ?? "AICareerMentorUsers",
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// DI Registration - Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IResumeRepository, ResumeRepository>();
builder.Services.AddScoped<IChatRepository, ChatRepository>();
builder.Services.AddScoped<IInterviewRepository, InterviewRepository>();
builder.Services.AddScoped<ICodeRepository, CodeRepository>();
builder.Services.AddScoped<IRoadmapRepository, RoadmapRepository>();

// DI Registration - Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IResumeService, ResumeService>();
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IInterviewService, InterviewService>();
builder.Services.AddScoped<IRoadmapService, RoadmapService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IJobService, JobService>();
builder.Services.AddScoped<IAIService, RuleBasedAIService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// CORS must be positioned after UseRouting and before UseAuthentication/Authorization
app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

// Map API Controllers (Attribute routing)
app.MapControllers();

// Keep default MVC view routes
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// Seed database on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        JobPrepPortal.Data.DbInitializer.SeedAsync(context).GetAwaiter().GetResult();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

app.Run();
