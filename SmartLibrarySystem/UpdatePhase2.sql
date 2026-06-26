-- Phase 2 Database Updates
USE SmartLibraryDB;
GO

-- 1. Create Stored Procedure for Paying Fines
CREATE OR ALTER PROCEDURE sp_PayFine
    @FineID INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION
        
        UPDATE FineManagement SET IsPaid = 1, FineDate = GETDATE() WHERE FineID = @FineID;
        
        DECLARE @UserID INT;
        SELECT @UserID = UserID FROM FineManagement WHERE FineID = @FineID;
        
        INSERT INTO ActivityLogs (UserID, Action) 
        VALUES (@UserID, 'Paid Fine ID: ' + CAST(@FineID AS VARCHAR));
        
        COMMIT TRANSACTION;
        SELECT 'Success' AS Result;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT ERROR_MESSAGE() AS Result;
    END CATCH
END;
GO

-- 2. Update existing dummy books with high-quality Cover Images
UPDATE Books SET CoverImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80' WHERE BookID = 1;

-- Add a few more books for visual flair
INSERT INTO Books (Title, ISBN, CategoryID, AuthorID, TotalCopies, AvailableCopies, CoverImage)
VALUES 
('The Pragmatic Programmer', '9780135957059', 1, 1, 3, 3, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80'),
('Harry Potter and the Sorcerer''s Stone', '9780590353427', 2, 2, 10, 10, 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?w=500&q=80'),
('A Brief History of Time', '9780553380163', 3, 3, 5, 5, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80');
GO
