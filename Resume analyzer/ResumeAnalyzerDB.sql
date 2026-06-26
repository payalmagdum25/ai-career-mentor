-- SQL Server Script for Resume Analyzer

-- 1. Create the database
CREATE DATABASE ResumeAnalyzerDB;
GO

USE ResumeAnalyzerDB;
GO

-- 2. Create the Resumes table
CREATE TABLE Resumes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CandidateName NVARCHAR(100),
    FilePath NVARCHAR(MAX),
    ExtractedText NVARCHAR(MAX),
    MatchScore DECIMAL(5,2),
    MatchedKeywords NVARCHAR(MAX),
    MissingKeywords NVARCHAR(MAX),
    UploadDate DATETIME DEFAULT GETDATE()
);
GO
