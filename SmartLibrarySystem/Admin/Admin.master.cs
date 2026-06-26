using System;
using System.Web;

public partial class AdminMaster : System.Web.UI.MasterPage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        // Simple authentication check
        if (Session["Role"] == null || Session["Role"].ToString() != "Admin")
        {
            Response.Redirect("../Login.aspx");
        }
    }

    protected void btnLogout_Click(object sender, EventArgs e)
    {
        Session.Clear();
        Session.Abandon();
        Response.Redirect("../Login.aspx");
    }
}
