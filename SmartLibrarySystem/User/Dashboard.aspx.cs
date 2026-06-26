using System;

public partial class User_Dashboard : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            LoadDashboard();
        }
    }

    private void LoadDashboard()
    {
        string userId = "";
        if (Session["UserID"] != null)
        {
            userId = Session["UserID"].ToString();
        }
        if (string.IsNullOrEmpty(userId)) return;

        // Fetch user stats
        string statsQuery = @"
            SELECT 
                (SELECT COUNT(*) FROM IssuedBooks WHERE UserID = @UserID AND Status = 'Issued') AS ActiveIssues,
                (SELECT ISNULL(SUM(FineAmount), 0) FROM FineManagement WHERE UserID = @UserID AND IsPaid = 0) AS PendingFines,
                (SELECT COUNT(*) FROM IssuedBooks WHERE UserID = @UserID AND Status = 'Returned') AS TotalRead";
                
        System.Data.DataTable dtStats = SmartLibrarySystem.DatabaseHelper.ExecuteQuery(statsQuery, new System.Data.SqlClient.SqlParameter[] { new System.Data.SqlClient.SqlParameter("@UserID", userId) });
        
        if (dtStats.Rows.Count > 0)
        {
            lblActiveIssues.Text = dtStats.Rows[0]["ActiveIssues"].ToString();
            lblPendingFines.Text = Convert.ToDecimal(dtStats.Rows[0]["PendingFines"]).ToString("0.00");
            lblTotalRead.Text = dtStats.Rows[0]["TotalRead"].ToString();
        }

        // Fetch active issues & fines
        string gridQuery = @"
            SELECT i.IssueID, b.Title, i.IssueDate, i.DueDate, 
                   ISNULL(f.FineAmount, 0) AS FineAmount, f.FineID
            FROM IssuedBooks i
            JOIN Books b ON i.BookID = b.BookID
            LEFT JOIN FineManagement f ON i.IssueID = f.IssueID AND f.IsPaid = 0
            WHERE i.UserID = @UserID AND i.Status = 'Issued'";

        System.Data.DataTable dtGrid = SmartLibrarySystem.DatabaseHelper.ExecuteQuery(gridQuery, new System.Data.SqlClient.SqlParameter[] { new System.Data.SqlClient.SqlParameter("@UserID", userId) });
        gvIssues.DataSource = dtGrid;
        gvIssues.DataBind();
    }

    protected void gvIssues_RowCommand(object sender, System.Web.UI.WebControls.GridViewCommandEventArgs e)
    {
        if (e.CommandName == "PayFine")
        {
            string fineId = e.CommandArgument.ToString();
            
            System.Data.DataTable dt = SmartLibrarySystem.DatabaseHelper.ExecuteStoredProcedure("sp_PayFine", 
                new System.Data.SqlClient.SqlParameter[] { new System.Data.SqlClient.SqlParameter("@FineID", fineId) });
            
            if (dt.Rows.Count > 0 && dt.Rows[0]["Result"].ToString() == "Success")
            {
                ClientScript.RegisterStartupScript(this.GetType(), "success", "showToast('success', 'Payment Successful', 'Your fine has been paid.');", true);
                LoadDashboard();
            }
        }
    }
}
