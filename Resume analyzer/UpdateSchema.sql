USE ResumeAnalyzerDB;
GO

-- Add new columns for AI Analysis Feedback
IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'Suggestions' AND Object_ID = Object_ID(N'Resumes'))
BEGIN
    ALTER TABLE Resumes ADD Suggestions NVARCHAR(MAX) NULL;
END
GO

IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'Strengths' AND Object_ID = Object_ID(N'Resumes'))
BEGIN
    ALTER TABLE Resumes ADD Strengths NVARCHAR(MAX) NULL;
END
GO
