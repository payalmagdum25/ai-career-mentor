using System;
using System.Data;
using System.Data.SqlClient;

public partial class Login : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            if (Session["UserID"] != null)
            {
                RedirectUser(Session["Role"].ToString());
            }
        }
    }

    protected void btnLogin_Click(object sender, EventArgs e)
    {
        string email = txtEmail.Text.Trim();
        string password = txtPassword.Text.Trim(); // In Phase 3, this should be compared with SHA256

        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
        {
            lblMessage.Text = "Please enter both Email and Password.";
            return;
        }

        string query = @"SELECT u.UserID, u.FullName, u.AvatarUrl, r.RoleName 
                         FROM Users u 
                         JOIN Roles r ON u.RoleID = r.RoleID 
                         WHERE u.Email = @Email AND u.PasswordHash = @Password AND u.IsActive = 1";

        SqlParameter[] parameters = new SqlParameter[]
        {
            new SqlParameter("@Email", email),
            new SqlParameter("@Password", password)
        };

        DataTable dt = SmartLibrarySystem.DatabaseHelper.ExecuteQuery(query, parameters);

        if (dt.Rows.Count > 0)
        {
            // Login Success
            Session["UserID"] = dt.Rows[0]["UserID"].ToString();
            Session["FullName"] = dt.Rows[0]["FullName"].ToString();
            Session["Role"] = dt.Rows[0]["RoleName"].ToString();
            Session["AvatarUrl"] = dt.Rows[0]["AvatarUrl"].ToString();

            // Log activity
            string logQuery = "INSERT INTO ActivityLogs (UserID, Action, IPAddress) VALUES (@UserID, 'Logged In', '127.0.0.1')";
            SmartLibrarySystem.DatabaseHelper.ExecuteNonQuery(logQuery, new SqlParameter[] { new SqlParameter("@UserID", Session["UserID"]) });

            // Update LastLogin
            string updateLogin = "UPDATE Users SET LastLogin = GETDATE() WHERE UserID = @UserID";
            SmartLibrarySystem.DatabaseHelper.ExecuteNonQuery(updateLogin, new SqlParameter[] { new SqlParameter("@UserID", Session["UserID"]) });

            RedirectUser(Session["Role"].ToString());
        }
        else
        {
            lblMessage.Text = "Invalid email or password.";
        }
    }

    private void RedirectUser(string role)
    {
        if (role == "SuperAdmin")
            Response.Redirect("~/Admin/Dashboard.aspx"); // We'll build SuperAdmin dashboard next
        else if (role == "Librarian")
            Response.Redirect("~/Admin/Dashboard.aspx");
        else
            Response.Redirect("~/User/Dashboard.aspx");
    }
}
