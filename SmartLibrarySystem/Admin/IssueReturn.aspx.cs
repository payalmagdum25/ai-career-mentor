using System;
using System.Data;
using System.Data.SqlClient;

public partial class Admin_IssueReturn : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    protected void btnIssue_Click(object sender, EventArgs e)
    {
        if (string.IsNullOrEmpty(txtIssueBookID.Text) || string.IsNullOrEmpty(txtIssueUserID.Text))
        {
            lblIssueMsg.Text = "Please fill all fields.";
            lblIssueMsg.CssClass = "text-danger d-block mb-3 fw-bold";
            return;
        }

        SqlParameter[] parameters = new SqlParameter[]
        {
            new SqlParameter("@BookID", txtIssueBookID.Text),
            new SqlParameter("@UserID", txtIssueUserID.Text),
            new SqlParameter("@Days", txtDays.Text)
        };

        DataTable dt = SmartLibrarySystem.DatabaseHelper.ExecuteStoredProcedure("sp_IssueBook", parameters);
        
        if (dt.Rows.Count > 0)
        {
            string result = dt.Rows[0]["Result"].ToString();
            if (result == "Success")
            {
                lblIssueMsg.Text = "Book issued successfully!";
                lblIssueMsg.CssClass = "text-success d-block mb-3 fw-bold";
                txtIssueBookID.Text = "";
                txtIssueUserID.Text = "";
            }
            else
            {
                lblIssueMsg.Text = result;
                lblIssueMsg.CssClass = "text-danger d-block mb-3 fw-bold";
            }
        }
    }

    protected void btnReturn_Click(object sender, EventArgs e)
    {
        if (string.IsNullOrEmpty(txtReturnIssueID.Text))
        {
            lblReturnMsg.Text = "Please enter an Issue ID.";
            lblReturnMsg.CssClass = "text-danger d-block mb-3 fw-bold";
            return;
        }

        SqlParameter[] parameters = new SqlParameter[]
        {
            new SqlParameter("@IssueID", txtReturnIssueID.Text)
        };

        DataTable dt = SmartLibrarySystem.DatabaseHelper.ExecuteStoredProcedure("sp_ReturnBook", parameters);

        if (dt.Rows.Count > 0)
        {
            string result = dt.Rows[0]["Result"].ToString();
            if (result == "Success")
            {
                lblReturnMsg.Text = "Book returned successfully!";
                lblReturnMsg.CssClass = "text-success d-block mb-3 fw-bold";
                txtReturnIssueID.Text = "";
            }
            else
            {
                lblReturnMsg.Text = result;
                lblReturnMsg.CssClass = "text-danger d-block mb-3 fw-bold";
            }
        }
    }
}
