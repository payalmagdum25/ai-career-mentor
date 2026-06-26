using System;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI.WebControls;

public partial class User_Catalog : System.Web.UI.Page
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
        string query = @"SELECT b.BookID, b.Title, b.ISBN, b.CoverImage, c.CategoryName, a.AuthorName, b.AvailableCopies 
                         FROM Books b 
                         JOIN Categories c ON b.CategoryID = c.CategoryID 
                         JOIN Authors a ON b.AuthorID = a.AuthorID";

        if (!string.IsNullOrEmpty(search))
        {
            query += " WHERE b.Title LIKE @Search OR a.AuthorName LIKE @Search OR c.CategoryName LIKE @Search";
        }

        SqlParameter[] parameters = new SqlParameter[]
        {
            new SqlParameter("@Search", "%" + search + "%")
        };

        DataTable dt = SmartLibrarySystem.DatabaseHelper.ExecuteQuery(query, parameters);
        rptBooks.DataSource = dt;
        rptBooks.DataBind();
    }

    protected void btnSearch_Click(object sender, EventArgs e)
    {
        LoadBooks(txtSearch.Text.Trim());
    }

    protected void btnReserve_Click(object sender, EventArgs e)
    {
        // Simple reservation simulation
        LinkButton btn = (LinkButton)sender;
        string bookId = btn.CommandArgument;
        
        ClientScript.RegisterStartupScript(this.GetType(), "success", "showToast('success', 'Reserved!', 'Book ID " + bookId + " reserved successfully.');", true);
    }
}
