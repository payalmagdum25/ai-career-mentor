using System;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI.WebControls;

namespace ResumeAnalyzer
{
    public partial class Results : System.Web.UI.Page
    {
        private string connectionString = @"Server=localhost;Database=ResumeAnalyzerDB;Trusted_Connection=True;";

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                BindGrid();
            }
        }

        private void BindGrid()
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = "SELECT Id, CandidateName, UploadDate, MatchScore, Strengths, Suggestions, MissingKeywords FROM Resumes ORDER BY MatchScore DESC";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    using (SqlDataAdapter sda = new SqlDataAdapter(cmd))
                    {
                        DataTable dt = new DataTable();
                        sda.Fill(dt);
                        gvResults.DataSource = dt;
                        gvResults.DataBind();
                    }
                }
            }
        }

        protected void gvResults_RowDataBound(object sender, GridViewRowEventArgs e)
        {
            if (e.Row.RowType == DataControlRowType.DataRow)
            {
                Label lblScore = (Label)e.Row.FindControl("lblScore");
                if (lblScore != null)
                {
                    string scoreText = lblScore.Text.Replace("%", "");
                    decimal score;
                    if (decimal.TryParse(scoreText, out score))
                    {
                        if (score >= 80)
                            lblScore.CssClass = "score-badge score-high";
                        else if (score >= 50)
                            lblScore.CssClass = "score-badge score-med";
                        else
                            lblScore.CssClass = "score-badge score-low";
                    }
                }
            }
        }

        protected string FormatMissingSkills(object missingKeywords)
        {
            if (missingKeywords == null || string.IsNullOrWhiteSpace(missingKeywords.ToString()))
                return "<span class='skill-badge empty'>None</span>";

            string[] skills = missingKeywords.ToString().Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            string result = "";
            foreach (var skill in skills)
            {
                result += "<span class='skill-badge missing'>" + skill.Trim() + "</span>";
            }
            return result;
        }
    }
}
