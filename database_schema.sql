/* 
   SQL Script for JobPortalDB 
   Run this script in SQL Server Management Studio (SSMS) 
*/

CREATE DATABASE JobPortalDB;
GO

USE JobPortalDB;
GO

-- Table for Jobs
CREATE TABLE Jobs (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(200) NOT NULL,
    Company NVARCHAR(200) NOT NULL,
    Location NVARCHAR(200),
    Salary NVARCHAR(100),
    Description NVARCHAR(MAX),
    Type NVARCHAR(50), -- Full-time, Part-time, Internship
    PostedDate DATETIME DEFAULT GETDATE(),
    ApplicationUrl NVARCHAR(MAX)
);

-- Table for Preparation Materials (Aptitude, DSA, Technical, HR)
CREATE TABLE PrepMaterials (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Category NVARCHAR(100) NOT NULL, -- Aptitude, Technical, etc.
    Title NVARCHAR(200) NOT NULL,
    Content NVARCHAR(MAX),
    Difficulty NVARCHAR(50), -- Easy, Medium, Hard
    CreatedDate DATETIME DEFAULT GETDATE()
);

-- Table for Practice Problems
CREATE TABLE PracticeProblems (
    Id INT PRIMARY KEY IDENTITY(1,1),
    PrepMaterialId INT FOREIGN KEY REFERENCES PrepMaterials(Id),
    ProblemTitle NVARCHAR(200),
    ProblemDescription NVARCHAR(MAX),
    Solution NVARCHAR(MAX)
);

-- Table for Company Hiring Process
CREATE TABLE CompanyProfiles (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(200) NOT NULL,
    LogoUrl NVARCHAR(MAX),
    ExamPattern NVARCHAR(MAX),
    Syllabus NVARCHAR(MAX),
    Eligibility NVARCHAR(MAX),
    HiringProcess NVARCHAR(MAX)
);

-- Table for DSA Sheets (Topic wise)
CREATE TABLE DsaProblems (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Topic NVARCHAR(100) NOT NULL, -- Arrays, Linked List, etc.
    Title NVARCHAR(200) NOT NULL,
    Link NVARCHAR(MAX),
    Difficulty NVARCHAR(50)
);

-- Seed Data (Optional but helpful for testing)
INSERT INTO Jobs (Title, Company, Location, Salary, Description, Type) 
VALUES ('Software Engineer', 'Google', 'Mountain View, CA', '$150,000', 'Work on cutting edge AI.', 'Full-time');

INSERT INTO PrepMaterials (Category, Title, Content, Difficulty)
VALUES ('Aptitude', 'Percentage Basics', 'Understand the core concepts of percentages...', 'Easy');

INSERT INTO CompanyProfiles (Name, ExamPattern, Syllabus, Eligibility)
VALUES ('TCS', 'Aptitude (20 Qs), Programming (2 Qs)', 'Math, English, Coding', '60% throughout academic career');

INSERT INTO DsaProblems (Topic, Title, Link, Difficulty)
VALUES ('Arrays', 'Two Sum', 'https://leetcode.com/problems/two-sum/', 'Easy');
