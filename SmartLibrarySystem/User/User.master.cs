using System;
using System.Web;

public partial class UserMaster : System.Web.UI.MasterPage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["Role"] == null || Session["Role"].ToString() != "Student")
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
