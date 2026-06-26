using System;
using System.Data.SqlClient;

public partial class Register : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected void btnRegister_Click(object sender, EventArgs e)
    {
        string name = txtName.Text.Trim();
        string email = txtEmail.Text.Trim();
        string phone = txtPhone.Text.Trim();
        string password = txtPassword.Text.Trim();
        string confirm = txtConfirm.Text.Trim();

        if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
        {
            lblMessage.Text = "Please fill out all required fields.";
            lblMessage.CssClass = "d-block mb-3 text-center fw-bold text-danger";
            return;
        }

        if (password != confirm)
        {
            lblMessage.Text = "Passwords do not match!";
            lblMessage.CssClass = "d-block mb-3 text-center fw-bold text-warning";
            return;
        }

        // Generate Avatar URL
        string avatarUrl = string.Format("https://ui-avatars.com/api/?name={0}&background=random&color=fff", Uri.EscapeDataString(name));

        // Insert as Student (RoleID = 3)
        string query = @"INSERT INTO Users (RoleID, FullName, Email, Phone, PasswordHash, AvatarUrl) 
                         VALUES (3, @Name, @Email, @Phone, @Password, @AvatarUrl)";

        SqlParameter[] parameters = new SqlParameter[]
        {
            new SqlParameter("@Name", name),
            new SqlParameter("@Email", email),
            new SqlParameter("@Phone", phone),
            new SqlParameter("@Password", password), // In Phase 3 production, we will implement SHA256 hashing here
            new SqlParameter("@AvatarUrl", avatarUrl)
        };

        try
        {
            int rows = SmartLibrarySystem.DatabaseHelper.ExecuteNonQuery(query, parameters);
            if (rows > 0)
            {
                lblMessage.Text = "Registration Successful! Redirecting to Login...";
                lblMessage.CssClass = "d-block mb-3 text-center fw-bold text-success";
                
                // Add a small delay then redirect
                ClientScript.RegisterStartupScript(this.GetType(), "redirect", "setTimeout(function(){ window.location.href = 'Login.aspx'; }, 2000);", true);
            }
        }
        catch (SqlException ex)
        {
            if (ex.Number == 2627) // Unique constraint violation
            {
                lblMessage.Text = "This email is already registered.";
            }
            else
            {
                lblMessage.Text = "An error occurred during registration. Please try again.";
            }
            lblMessage.CssClass = "d-block mb-3 text-center fw-bold text-danger";
        }
    }
}
