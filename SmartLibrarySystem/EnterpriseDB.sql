-- =======================================================================================
-- THE ULTIMATE SMART LIBRARY PLATFORM - ENTERPRISE DATABASE SCHEMA
-- =======================================================================================

IF DB_ID('SmartLibraryEnterpriseDB') IS NULL
BEGIN
    CREATE DATABASE SmartLibraryEnterpriseDB;
END
GO

USE SmartLibraryEnterpriseDB;
GO

-- ==========================================
-- 1. SECURITY & ACCESS CONTROL
-- ==========================================
CREATE TABLE Roles (
    RoleID INT PRIMARY KEY IDENTITY(1,1),
    RoleName VARCHAR(50) NOT NULL UNIQUE -- 'SuperAdmin', 'Librarian', 'Student'
);

CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    RoleID INT FOREIGN KEY REFERENCES Roles(RoleID),
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(256) NOT NULL, -- Will store SHA256 hashes
    AvatarUrl VARCHAR(500) DEFAULT 'https://ui-avatars.com/api/?name=User',
    Phone VARCHAR(20),
    IsActive BIT DEFAULT 1,
    RegistrationDate DATETIME DEFAULT GETDATE(),
    LastLogin DATETIME
);

-- ==========================================
-- 2. CORE LIBRARY CATALOG
-- ==========================================
CREATE TABLE Categories (
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryName VARCHAR(100) NOT NULL UNIQUE,
    IconClass VARCHAR(50) -- e.g., 'fas fa-laptop-code'
);

CREATE TABLE Authors (
    AuthorID INT PRIMARY KEY IDENTITY(1,1),
    AuthorName VARCHAR(100) NOT NULL,
    Biography NVARCHAR(MAX)
);

CREATE TABLE Publishers (
    PublisherID INT PRIMARY KEY IDENTITY(1,1),
    PublisherName VARCHAR(100) NOT NULL,
    ContactEmail VARCHAR(100)
);

CREATE TABLE Books (
    BookID INT PRIMARY KEY IDENTITY(1,1),
    CategoryID INT FOREIGN KEY REFERENCES Categories(CategoryID),
    AuthorID INT FOREIGN KEY REFERENCES Authors(AuthorID),
    PublisherID INT FOREIGN KEY REFERENCES Publishers(PublisherID),
    Title VARCHAR(255) NOT NULL,
    ISBN VARCHAR(20) UNIQUE,
    CoverImage VARCHAR(500),
    Description NVARCHAR(MAX),
    PublishedYear INT,
    TotalPhysicalCopies INT DEFAULT 0,
    AvailablePhysicalCopies INT DEFAULT 0,
    IsDigitalAvailable BIT DEFAULT 0,
    AverageRating DECIMAL(3,2) DEFAULT 0.00,
    DateAdded DATETIME DEFAULT GETDATE()
);

-- ==========================================
-- 3. ADVANCED INVENTORY MANAGEMENT
-- ==========================================
-- Tracks individual physical copies (e.g., using barcodes)
CREATE TABLE BookCopies (
    CopyID INT PRIMARY KEY IDENTITY(1,1),
    BookID INT FOREIGN KEY REFERENCES Books(BookID),
    Barcode VARCHAR(50) UNIQUE,
    Condition VARCHAR(50) DEFAULT 'Good', -- 'Good', 'Damaged', 'Lost'
    Status VARCHAR(50) DEFAULT 'Available' -- 'Available', 'Borrowed', 'Reserved', 'Maintenance'
);

-- Tracks Digital PDFs / Epubs
CREATE TABLE DigitalBooks (
    DigitalID INT PRIMARY KEY IDENTITY(1,1),
    BookID INT FOREIGN KEY REFERENCES Books(BookID),
    FileUrl VARCHAR(500) NOT NULL,
    FileSizeMB DECIMAL(5,2),
    Downloads INT DEFAULT 0
);

-- ==========================================
-- 4. CIRCULATION & OPERATIONS
-- ==========================================
CREATE TABLE BorrowedBooks (
    BorrowID INT PRIMARY KEY IDENTITY(1,1),
    CopyID INT FOREIGN KEY REFERENCES BookCopies(CopyID),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    LibrarianID INT FOREIGN KEY REFERENCES Users(UserID), -- The staff who issued it
    IssueDate DATETIME DEFAULT GETDATE(),
    DueDate DATETIME NOT NULL,
    ReturnDate DATETIME NULL,
    Status VARCHAR(20) DEFAULT 'Issued' -- 'Issued', 'Returned', 'Overdue', 'Lost'
);

CREATE TABLE FinePayments (
    FineID INT PRIMARY KEY IDENTITY(1,1),
    BorrowID INT FOREIGN KEY REFERENCES BorrowedBooks(BorrowID),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    FineAmount DECIMAL(10,2) NOT NULL,
    Reason VARCHAR(100) DEFAULT 'Late Return',
    IsPaid BIT DEFAULT 0,
    PaymentDate DATETIME NULL,
    PaymentMethod VARCHAR(50) -- 'Online', 'Cash'
);

CREATE TABLE Reservations (
    ReservationID INT PRIMARY KEY IDENTITY(1,1),
    BookID INT FOREIGN KEY REFERENCES Books(BookID),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    ReservationDate DATETIME DEFAULT GETDATE(),
    Status VARCHAR(50) DEFAULT 'Pending' -- 'Pending', 'Approved', 'Fulfilled', 'Cancelled'
);

-- ==========================================
-- 5. USER ENGAGEMENT & AI FEATURES
-- ==========================================
CREATE TABLE Reviews (
    ReviewID INT PRIMARY KEY IDENTITY(1,1),
    BookID INT FOREIGN KEY REFERENCES Books(BookID),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    ReviewText NVARCHAR(MAX),
    ReviewDate DATETIME DEFAULT GETDATE()
);

CREATE TABLE Wishlist (
    WishlistID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    BookID INT FOREIGN KEY REFERENCES Books(BookID),
    AddedDate DATETIME DEFAULT GETDATE()
);

CREATE TABLE ReadingHistory (
    HistoryID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    BookID INT FOREIGN KEY REFERENCES Books(BookID),
    ActionType VARCHAR(50), -- 'Borrowed', 'Read Digital', 'Reserved'
    ActionDate DATETIME DEFAULT GETDATE()
);

-- ==========================================
-- 6. SYSTEM LOGS & MANAGEMENT
-- ==========================================
CREATE TABLE Notifications (
    NotificationID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Message NVARCHAR(255) NOT NULL,
    Type VARCHAR(50), -- 'Alert', 'Success', 'Warning'
    IsRead BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE ActivityLogs (
    LogID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Action NVARCHAR(MAX) NOT NULL,
    IPAddress VARCHAR(50),
    Timestamp DATETIME DEFAULT GETDATE()
);

CREATE TABLE SupportTickets (
    TicketID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Subject VARCHAR(100) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    Status VARCHAR(50) DEFAULT 'Open',
    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE AttendanceLogs (
    AttendanceID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    EntryTime DATETIME DEFAULT GETDATE(),
    ExitTime DATETIME NULL
);

CREATE TABLE SystemSettings (
    SettingKey VARCHAR(50) PRIMARY KEY,
    SettingValue VARCHAR(255) NOT NULL,
    Description VARCHAR(255)
);

-- ==========================================
-- DUMMY DATA INSERTS
-- ==========================================

-- Roles
INSERT INTO Roles (RoleName) VALUES ('SuperAdmin'), ('Librarian'), ('Student');

-- Admin User (Password is hashed 'admin123' simulated here as plain text for testing, will implement SHA256 in C# later)
INSERT INTO Users (RoleID, FullName, Email, PasswordHash, AvatarUrl) 
VALUES (1, 'System Administrator', 'admin@library.com', 'admin123', 'https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff');

-- Librarian User
INSERT INTO Users (RoleID, FullName, Email, PasswordHash, AvatarUrl) 
VALUES (2, 'Head Librarian', 'librarian@library.com', 'lib123', 'https://ui-avatars.com/api/?name=Librarian&background=10B981&color=fff');

-- Student User
INSERT INTO Users (RoleID, FullName, Email, PasswordHash, AvatarUrl) 
VALUES (3, 'John Doe Student', 'student@library.com', 'student123', 'https://ui-avatars.com/api/?name=John+Doe&background=F59E0B&color=fff');

-- Categories
INSERT INTO Categories (CategoryName, IconClass) VALUES 
('Computer Science', 'fas fa-laptop-code'),
('Fantasy Fiction', 'fas fa-dragon'),
('Science & Nature', 'fas fa-flask'),
('Business & Economics', 'fas fa-chart-line');

-- Authors
INSERT INTO Authors (AuthorName) VALUES ('Robert C. Martin'), ('J.K. Rowling'), ('Stephen Hawking');

-- Publishers
INSERT INTO Publishers (PublisherName) VALUES ('Prentice Hall'), ('Bloomsbury'), ('Bantam Books');

-- Books
INSERT INTO Books (CategoryID, AuthorID, PublisherID, Title, ISBN, CoverImage, TotalPhysicalCopies, AvailablePhysicalCopies, IsDigitalAvailable)
VALUES 
(1, 1, 1, 'Clean Code', '9780132350884', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80', 5, 5, 1),
(2, 2, 2, 'Harry Potter', '9780590353427', 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?w=500&q=80', 10, 10, 0),
(3, 3, 3, 'A Brief History of Time', '9780553380163', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80', 3, 3, 1);

-- Settings
INSERT INTO SystemSettings (SettingKey, SettingValue, Description) VALUES
('FinePerDay', '2.00', 'Daily fine for overdue books in USD'),
('MaxBorrowDays', '14', 'Maximum days a student can keep a book');

GO

-- ==========================================
-- TRIGGERS & PROCEDURES (AI-Like Engines)
-- ==========================================

-- Trigger to update Average Rating automatically when a review is added
CREATE TRIGGER trg_UpdateAverageRating
ON Reviews
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    DECLARE @BookID INT;
    IF EXISTS(SELECT 1 FROM inserted) SELECT @BookID = BookID FROM inserted;
    ELSE SELECT @BookID = BookID FROM deleted;

    UPDATE Books 
    SET AverageRating = ISNULL((SELECT AVG(CAST(Rating AS DECIMAL(3,2))) FROM Reviews WHERE BookID = @BookID), 0)
    WHERE BookID = @BookID;
END;
GO
