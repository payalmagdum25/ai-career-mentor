using System;
using System.Data;
using System.Data.SqlClient;

public partial class Admin_ManageBooks : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            LoadBooks();
        }
    }

    private void LoadBooks(string search = "")
    {
        string query = @"SELECT b.BookID, b.CoverImage, b.Title, b.ISBN, c.CategoryName, a.AuthorName, b.TotalCopies, b.AvailableCopies 
                         FROM Books b 
                         JOIN Categories c ON b.CategoryID = c.CategoryID 
                         JOIN Authors a ON b.AuthorID = a.AuthorID";

        if (!string.IsNullOrEmpty(search))
        {
            query += " WHERE b.Title LIKE @Search OR b.ISBN LIKE @Search OR a.AuthorName LIKE @Search";
        }

        SqlParameter[] parameters = new SqlParameter[]
        {
            new SqlParameter("@Search", "%" + search + "%")
        };

        DataTable dt = SmartLibrarySystem.DatabaseHelper.ExecuteQuery(query, parameters);
        gvBooks.DataSource = dt;
        gvBooks.DataBind();
    }

    protected void btnSearch_Click(object sender, EventArgs e)
    {
        LoadBooks(txtSearch.Text.Trim());
    }

    protected void btnAddBook_Click(object sender, EventArgs e)
    {
        string query = "INSERT INTO Books (Title, ISBN, CategoryID, AuthorID, TotalCopies, AvailableCopies, CoverImage) VALUES (@Title, @ISBN, @CatID, @AuthID, @Copies, @Copies, @Cover)";
        
        string coverUrl = txtCoverUrl.Text.Trim();
        if (string.IsNullOrEmpty(coverUrl)) coverUrl = "https://via.placeholder.com/400x600?text=No+Cover";

        SqlParameter[] parameters = new SqlParameter[]
        {
            new SqlParameter("@Title", txtNewTitle.Text),
            new SqlParameter("@ISBN", txtNewISBN.Text),
            new SqlParameter("@CatID", txtCatID.Text),
            new SqlParameter("@AuthID", txtAuthID.Text),
            new SqlParameter("@Copies", txtCopies.Text),
            new SqlParameter("@Cover", coverUrl)
        };

        int rows = SmartLibrarySystem.DatabaseHelper.ExecuteNonQuery(query, parameters);
        if (rows > 0)
        {
            ClientScript.RegisterStartupScript(this.GetType(), "success", "showToast('success', 'Success', 'Book added successfully!');", true);
            LoadBooks();
        }
    }
}
