using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using JobPrepPortal.Models;

namespace JobPrepPortal.Data
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            // 1. Seed Skills if empty
            if (!context.Skills.Any())
            {
                var skills = new List<Skill>
                {
                    new Skill { SkillName = "React" },
                    new Skill { SkillName = "JavaScript" },
                    new Skill { SkillName = "C#" },
                    new Skill { SkillName = ".NET" },
                    new Skill { SkillName = "SQL Server" },
                    new Skill { SkillName = "Python" },
                    new Skill { SkillName = "Data Structures" },
                    new Skill { SkillName = "Algorithms" },
                    new Skill { SkillName = "Git" },
                    new Skill { SkillName = "Cloud Computing" }
                };
                await context.Skills.AddRangeAsync(skills);
                await context.SaveChangesAsync();
            }

            // 2. Seed Coding Problems if empty
            if (!context.CodingProblems.Any())
            {
                var problems = new List<CodingProblem>
                {
                    new CodingProblem
                    {
                        Title = "Two Sum",
                        Difficulty = "Easy",
                        Description = "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
                        ExampleInput = "nums = [2,7,11,15], target = 9",
                        ExampleOutput = "[0,1]"
                    },
                    new CodingProblem
                    {
                        Title = "Valid Parentheses",
                        Difficulty = "Easy",
                        Description = "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if open brackets are closed by the same type of brackets and closed in the correct order.",
                        ExampleInput = "s = \"()[]{}\"",
                        ExampleOutput = "true"
                    },
                    new CodingProblem
                    {
                        Title = "Container With Most Water",
                        Difficulty = "Medium",
                        Description = "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.",
                        ExampleInput = "height = [1,8,6,2,5,4,8,3,7]",
                        ExampleOutput = "49"
                    },
                    new CodingProblem
                    {
                        Title = "Reverse Linked List",
                        Difficulty = "Easy",
                        Description = "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
                        ExampleInput = "head = [1,2,3,4,5]",
                        ExampleOutput = "[5,4,3,2,1]"
                    },
                    new CodingProblem
                    {
                        Title = "Longest Palindromic Substring",
                        Difficulty = "Medium",
                        Description = "Given a string `s`, return the longest palindromic substring in `s`.",
                        ExampleInput = "s = \"babad\"",
                        ExampleOutput = "\"bab\" (or \"aba\")"
                    }
                };
                await context.CodingProblems.AddRangeAsync(problems);
                await context.SaveChangesAsync();
            }

            // 3. Seed Jobs if empty
            if (!context.Jobs.Any())
            {
                var jobs = new List<Job>
                {
                    new Job
                    {
                        Title = "Frontend Developer (React)",
                        Company = "Google",
                        Location = "Mountain View, CA",
                        Salary = "$140,000 - $170,000",
                        Description = "Join the Google Search frontend team. Develop responsive interface features using React, TypeScript, and modern CSS techniques.",
                        Type = "Full-time",
                        PostedDate = DateTime.Now.AddDays(-2),
                        ApplicationUrl = "https://careers.google.com"
                    },
                    new Job
                    {
                        Title = "Software Development Engineer (SDE I)",
                        Company = "Amazon",
                        Location = "Seattle, WA",
                        Salary = "$125,000 - $145,000",
                        Description = "Build highly scalable services for Amazon Prime. Require strong DSA skills, Java/C#, and cloud architecture understanding.",
                        Type = "Full-time",
                        PostedDate = DateTime.Now.AddDays(-5),
                        ApplicationUrl = "https://amazon.jobs"
                    },
                    new Job
                    {
                        Title = "Full Stack .NET Engineer",
                        Company = "Microsoft",
                        Location = "Redmond, WA",
                        Salary = "$135,000 - $165,000",
                        Description = "Work on Azure core dev tools. Required expertise in ASP.NET Core, C#, Entity Framework, SQL Server, and React/Angular frontend.",
                        Type = "Full-time",
                        PostedDate = DateTime.Now.AddDays(-1),
                        ApplicationUrl = "https://careers.microsoft.com"
                    },
                    new Job
                    {
                        Title = "Software Engineering Intern",
                        Company = "Oracle",
                        Location = "Austin, TX (Remote)",
                        Salary = "$45 - $60 / hour",
                        Description = "Exciting opportunity for university students to work on enterprise database cloud tooling. Python, SQL, and Java experience preferred.",
                        Type = "Internship",
                        PostedDate = DateTime.Now.AddDays(-10),
                        ApplicationUrl = "https://oracle.com/careers"
                    }
                };
                await context.Jobs.AddRangeAsync(jobs);
                await context.SaveChangesAsync();
            }

            // 4. Seed Prep Materials if empty
            if (!context.PrepMaterials.Any())
            {
                var materials = new List<PrepMaterial>
                {
                    new PrepMaterial
                    {
                        Category = "Aptitude",
                        Title = "Percentage Basics & Fractions",
                        Content = "Understanding percentages is core to all numerical assessment tests. Fractions equivalent to key percentages: 1/2 = 50%, 1/4 = 25%, 1/8 = 12.5%, 1/3 = 33.3%, 1/5 = 20%, 1/6 = 16.6%. Speed tricks: X% of Y is equal to Y% of X.",
                        Difficulty = "Easy",
                        CreatedDate = DateTime.Now
                    },
                    new PrepMaterial
                    {
                        Category = "Technical",
                        Title = "C# Garbage Collection & Memory Management",
                        Content = "C# uses an automated Garbage Collector (GC) to manage heap memory allocation. Memory is divided into 3 Generations: Gen 0 (short-lived objects), Gen 1 (buffer/intermediate), and Gen 2 (long-lived assets). Understanding IDisposable and using statements prevents memory leakage in SQL connections.",
                        Difficulty = "Medium",
                        CreatedDate = DateTime.Now
                    }
                };
                await context.PrepMaterials.AddRangeAsync(materials);
                await context.SaveChangesAsync();
            }

            // 5. Seed Company Profiles if empty
            if (!context.CompanyProfiles.Any())
            {
                var companyProfiles = new List<CompanyProfile>
                {
                    new CompanyProfile
                    {
                        Name = "TCS",
                        LogoUrl = "https://logo.clearbit.com/tcs.com",
                        ExamPattern = "TCS NQT: 80-minute test. Includes Numerical Ability, Verbal Ability, Reasoning Ability, and 2 Coding Questions (Data Structures and Algorithms).",
                        Syllabus = "Math (Percentages, Time & Work), English (Grammar, Comprehension), DSA (Arrays, Strings, LinkedList).",
                        Eligibility = "BE/BTech/MCA. 60% or 6.0 CGPA throughout academic career. Max 1 active backlog.",
                        HiringProcess = "Online Test -> Technical Interview -> HR Round"
                    },
                    new CompanyProfile
                    {
                        Name = "Microsoft",
                        LogoUrl = "https://logo.clearbit.com/microsoft.com",
                        ExamPattern = "Online Assessment (2-3 Coding Questions) -> Phone Screen -> 4 rounds of technical onsite interviews covering Systems Design and Algorithms.",
                        Syllabus = "Advanced DSA (Trees, Graphs, Dynamic Programming), System Design (Caching, Load Balancer, DB Sharding), OOP principles.",
                        Eligibility = "No strict GPA barrier, but strong core computing foundation required.",
                        HiringProcess = "Online Coding Test -> Technical Video Call -> Onsite Loop (4 technical interviews)"
                    }
                };
                await context.CompanyProfiles.AddRangeAsync(companyProfiles);
                await context.SaveChangesAsync();
            }

            // 6. Seed DSA Problems if empty
            if (!context.DsaProblems.Any())
            {
                var dsa = new List<DsaProblem>
                {
                    new DsaProblem
                    {
                        Topic = "Arrays",
                        Title = "Two Sum",
                        Link = "https://leetcode.com/problems/two-sum/",
                        Difficulty = "Easy"
                    },
                    new DsaProblem
                    {
                        Topic = "Strings",
                        Title = "Valid Palindrome",
                        Link = "https://leetcode.com/problems/valid-palindrome/",
                        Difficulty = "Easy"
                    },
                    new DsaProblem
                    {
                        Topic = "Linked List",
                        Title = "Reverse Linked List",
                        Link = "https://leetcode.com/problems/reverse-linked-list/",
                        Difficulty = "Easy"
                    }
                };
                await context.DsaProblems.AddRangeAsync(dsa);
                await context.SaveChangesAsync();
            }
        }
    }
}
