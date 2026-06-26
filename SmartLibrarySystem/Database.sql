-- Smart Library Management System Database Schema
IF DB_ID('SmartLibraryDB') IS NULL
BEGIN
    CREATE DATABASE SmartLibraryDB;
END
GO

USE SmartLibraryDB;
GO

-- 1. Roles Table
CREATE TABLE Roles (
    RoleID INT PRIMARY KEY IDENTITY(1,1),
    RoleName VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO Roles (RoleName) VALUES ('Admin'), ('Student');

-- 2. Users Table
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    RoleID INT FOREIGN KEY REFERENCES Roles(RoleID),
    RegistrationDate DATETIME DEFAULT GETDATE(),
    IsActive BIT DEFAULT 1
);

-- Default Admin User (Password: admin123 -> Hash it in application, but for demo we can use plain text or hardcode a hash. 
-- In real world, use BCrypt. Let's insert a dummy admin)
INSERT INTO Users (FullName, Email, PasswordHash, RoleID) 
VALUES ('System Admin', 'admin@library.com', 'admin123', 1);

-- 3. Categories Table
CREATE TABLE Categories (
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryName VARCHAR(100) NOT NULL UNIQUE
);

-- 4. Authors Table
CREATE TABLE Authors (
    AuthorID INT PRIMARY KEY IDENTITY(1,1),
    AuthorName VARCHAR(100) NOT NULL
);

-- 5. Books Table
CREATE TABLE Books (
    BookID INT PRIMARY KEY IDENTITY(1,1),
    Title VARCHAR(255) NOT NULL,
    ISBN VARCHAR(50) UNIQUE,
    CategoryID INT FOREIGN KEY REFERENCES Categories(CategoryID),
    AuthorID INT FOREIGN KEY REFERENCES Authors(AuthorID),
    Publisher VARCHAR(100),
    PublishYear INT,
    TotalCopies INT DEFAULT 1,
    AvailableCopies INT DEFAULT 1,
    CoverImage VARCHAR(255), -- Path to image
    AddedDate DATETIME DEFAULT GETDATE()
);

-- 6. IssuedBooks Table
CREATE TABLE IssuedBooks (
    IssueID INT PRIMARY KEY IDENTITY(1,1),
    BookID INT FOREIGN KEY REFERENCES Books(BookID),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    IssueDate DATETIME DEFAULT GETDATE(),
    DueDate DATETIME NOT NULL,
    ReturnDate DATETIME NULL,
    Status VARCHAR(20) DEFAULT 'Issued' -- 'Issued', 'Returned', 'Overdue'
);

-- 7. FineManagement Table
CREATE TABLE FineManagement (
    FineID INT PRIMARY KEY IDENTITY(1,1),
    IssueID INT FOREIGN KEY REFERENCES IssuedBooks(IssueID),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    FineAmount DECIMAL(10,2) NOT NULL,
    FineDate DATETIME DEFAULT GETDATE(),
    IsPaid BIT DEFAULT 0
);

-- 8. ActivityLogs Table
CREATE TABLE ActivityLogs (
    LogID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Action VARCHAR(255),
    LogDate DATETIME DEFAULT GETDATE()
);
GO

-- Stored Procedures

-- SP to Issue Book
CREATE PROCEDURE sp_IssueBook
    @BookID INT,
    @UserID INT,
    @Days INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION
        
        DECLARE @Available INT;
        SELECT @Available = AvailableCopies FROM Books WHERE BookID = @BookID;
        
        IF @Available > 0
        BEGIN
            INSERT INTO IssuedBooks (BookID, UserID, DueDate) 
            VALUES (@BookID, @UserID, DATEADD(DAY, @Days, GETDATE()));
            
            UPDATE Books SET AvailableCopies = AvailableCopies - 1 WHERE BookID = @BookID;
            
            INSERT INTO ActivityLogs (UserID, Action) 
            VALUES (@UserID, 'Issued Book ID: ' + CAST(@BookID AS VARCHAR));
            
            COMMIT TRANSACTION;
            SELECT 'Success' AS Result;
        END
        ELSE
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 'No copies available' AS Result;
        END
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT ERROR_MESSAGE() AS Result;
    END CATCH
END;
GO

-- SP to Return Book
CREATE PROCEDURE sp_ReturnBook
    @IssueID INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION
        
        DECLARE @BookID INT, @UserID INT, @DueDate DATETIME, @ReturnDate DATETIME = GETDATE();
        
        SELECT @BookID = BookID, @UserID = UserID, @DueDate = DueDate 
        FROM IssuedBooks WHERE IssueID = @IssueID AND Status = 'Issued';
        
        IF @BookID IS NOT NULL
        BEGIN
            UPDATE IssuedBooks SET ReturnDate = @ReturnDate, Status = 'Returned' WHERE IssueID = @IssueID;
            UPDATE Books SET AvailableCopies = AvailableCopies + 1 WHERE BookID = @BookID;
            
            -- Calculate fine if overdue (e.g., 5 per day)
            IF @ReturnDate > @DueDate
            BEGIN
                DECLARE @DaysLate INT = DATEDIFF(DAY, @DueDate, @ReturnDate);
                IF @DaysLate > 0
                BEGIN
                    INSERT INTO FineManagement (IssueID, UserID, FineAmount) 
                    VALUES (@IssueID, @UserID, @DaysLate * 5.00);
                END
            END
            
            INSERT INTO ActivityLogs (UserID, Action) 
            VALUES (@UserID, 'Returned Book ID: ' + CAST(@BookID AS VARCHAR));
            
            COMMIT TRANSACTION;
            SELECT 'Success' AS Result;
        END
        ELSE
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT 'Invalid Issue ID or already returned' AS Result;
        END
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT ERROR_MESSAGE() AS Result;
    END CATCH
END;
GO

-- Dummy Data
INSERT INTO Categories (CategoryName) VALUES ('Computer Science'), ('Fiction'), ('Science'), ('History');
INSERT INTO Authors (AuthorName) VALUES ('Robert C. Martin'), ('J.K. Rowling'), ('Stephen Hawking');

INSERT INTO Books (Title, ISBN, CategoryID, AuthorID, TotalCopies, AvailableCopies)
VALUES ('Clean Code', '9780132350884', 1, 1, 5, 5);
GO
