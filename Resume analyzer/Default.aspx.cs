using System;
using System.IO;
using System.Data.SqlClient;
using System.Linq;
using System.Text.RegularExpressions;
using System.Configuration;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;

namespace ResumeAnalyzer
{
    public partial class Default : System.Web.UI.Page
    {
        private string connectionString = @"Server=localhost;Database=ResumeAnalyzerDB;Trusted_Connection=True;";

        protected void Page_Load(object sender, EventArgs e)
        {
        }

        protected async void btnUpload_Click(object sender, EventArgs e)
        {
            if (fuResume.HasFile)
            {
                try
                {
                    // 1. Save File
                    string uploadsFolder = Server.MapPath("~/Uploads/");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }
                    
                    string fileName = System.IO.Path.GetFileName(fuResume.PostedFile.FileName);
                    string savePath = System.IO.Path.Combine(uploadsFolder, fileName);
                    fuResume.SaveAs(savePath);

                    // 2. Parse PDF
                    string extractedText = ParsePdf(savePath);

                    // 3. Extract Keywords
                    string[] requiredKeywords = txtKeywords.Text.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                                                                .Select(k => k.Trim().ToLower())
                                                                .ToArray();
                    
                    // 4. Perform Advanced Analysis via OpenAI API
                    var analysisResult = await PerformDeepAnalysisAsync(extractedText, requiredKeywords);

                    // 5. Save to Database
                    SaveToDatabase(txtCandidateName.Text, savePath, extractedText, analysisResult);

                    pnlMessage.Visible = true;
                    pnlMessage.CssClass = "message success";
                    lblMessage.Text = "Analysis complete! Overall ATS Score: " + analysisResult.Score + "%";
                }
                catch (Exception ex)
                {
                    pnlMessage.Visible = true;
                    pnlMessage.CssClass = "message error";
                    lblMessage.Text = "Error: " + ex.Message;
                }
            }
        }

        private string ParsePdf(string filePath)
        {
            using (PdfReader reader = new PdfReader(filePath))
            {
                System.Text.StringBuilder text = new System.Text.StringBuilder();
                for (int i = 1; i <= reader.NumberOfPages; i++)
                {
                    text.Append(PdfTextExtractor.GetTextFromPage(reader, i));
                    text.Append(" ");
                }
                return text.ToString();
            }
        }

        private async System.Threading.Tasks.Task<AnalysisResult> PerformDeepAnalysisAsync(string text, string[] requiredKeywords)
        {
            string apiKey = ConfigurationManager.AppSettings["OpenAIApiKey"];
            if (string.IsNullOrEmpty(apiKey) || apiKey == "YOUR_API_KEY_HERE")
            {
                throw new Exception("Please configure your OpenAI API Key in web.config. Open the file and replace 'YOUR_API_KEY_HERE' with your real key.");
            }

            string targetKeywordsString = string.Join(", ", requiredKeywords);

            string prompt = $@"
You are an expert HR ATS (Applicant Tracking System) Analyzer. Analyze the following resume text against the target job keywords: '{targetKeywordsString}'.
Return a JSON object EXACTLY in the following format. Do NOT use markdown code blocks or any other text, just pure JSON:
{{
  ""Score"": <decimal between 0 and 100 representing the ATS match>,
  ""Matched"": ""<comma-separated list of keywords actually found in the resume>"",
  ""Missing"": ""<comma-separated list of crucial target keywords not found in the resume>"",
  ""Strengths"": [
    ""<specific, personalized strength bullet 1>"",
    ""<specific, personalized strength bullet 2>""
  ],
  ""Suggestions"": [
    ""<specific, actionable weakness/improvement bullet 1>"",
    ""<specific, actionable weakness/improvement bullet 2>""
  ]
}}

Resume Text:
{text}
";

            using (var client = new System.Net.Http.HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);
                
                var requestBody = new
                {
                    model = "gpt-3.5-turbo",
                    messages = new[]
                    {
                        new { role = "system", content = "You are a professional HR ATS system. Always return pure JSON." },
                        new { role = "user", content = prompt }
                    },
                    temperature = 0.3
                };

                var serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                string jsonBody = serializer.Serialize(requestBody);
                var content = new System.Net.Http.StringContent(jsonBody, System.Text.Encoding.UTF8, "application/json");

                var response = await client.PostAsync("https://api.openai.com/v1/chat/completions", content);
                string responseStr = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception("OpenAI API Error: " + responseStr);
                }

                // Parse response
                var apiResponse = serializer.Deserialize<System.Collections.Generic.Dictionary<string, object>>(responseStr);
                var choices = (System.Collections.ArrayList)apiResponse["choices"];
                var firstChoice = (System.Collections.Generic.Dictionary<string, object>)choices[0];
                var message = (System.Collections.Generic.Dictionary<string, object>)firstChoice["message"];
                string messageContent = message["content"].ToString();
                
                // Clean markdown if AI ignored instructions
                if (messageContent.StartsWith("```json")) { messageContent = messageContent.Substring(7); }
                if (messageContent.EndsWith("```")) { messageContent = messageContent.Substring(0, messageContent.Length - 3); }
                messageContent = messageContent.Trim();

                var aiResult = serializer.Deserialize<System.Collections.Generic.Dictionary<string, object>>(messageContent);

                // Format Strengths
                System.Text.StringBuilder strengthsHtml = new System.Text.StringBuilder();
                strengthsHtml.AppendLine("<ul>");
                if (aiResult.ContainsKey("Strengths") && aiResult["Strengths"] is System.Collections.ArrayList strengthsArray)
                {
                    foreach (var s in strengthsArray) strengthsHtml.AppendLine($"<li>{s}</li>");
                }
                strengthsHtml.AppendLine("</ul>");

                // Format Suggestions
                System.Text.StringBuilder suggestionsHtml = new System.Text.StringBuilder();
                suggestionsHtml.AppendLine("<ul>");
                if (aiResult.ContainsKey("Suggestions") && aiResult["Suggestions"] is System.Collections.ArrayList suggestionsArray)
                {
                    foreach (var s in suggestionsArray) suggestionsHtml.AppendLine($"<li>{s}</li>");
                }
                suggestionsHtml.AppendLine("</ul>");

                return new AnalysisResult
                {
                    Score = Convert.ToDecimal(aiResult.ContainsKey("Score") ? aiResult["Score"] : 0m),
                    Matched = aiResult.ContainsKey("Matched") ? aiResult["Matched"].ToString() : "",
                    Missing = aiResult.ContainsKey("Missing") ? aiResult["Missing"].ToString() : "",
                    Strengths = strengthsHtml.ToString().Trim(),
                    Suggestions = suggestionsHtml.ToString().Trim()
                };
            }
        }

        private void SaveToDatabase(string name, string path, string text, AnalysisResult result)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = @"INSERT INTO Resumes (CandidateName, FilePath, ExtractedText, MatchScore, MatchedKeywords, MissingKeywords, Suggestions, Strengths) 
                                 VALUES (@Name, @Path, @Text, @Score, @Matched, @Missing, @Suggestions, @Strengths)";
                
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Name", name);
                    cmd.Parameters.AddWithValue("@Path", path);
                    cmd.Parameters.AddWithValue("@Text", text);
                    cmd.Parameters.AddWithValue("@Score", result.Score);
                    cmd.Parameters.AddWithValue("@Matched", result.Matched);
                    cmd.Parameters.AddWithValue("@Missing", result.Missing);
                    cmd.Parameters.AddWithValue("@Suggestions", result.Suggestions);
                    cmd.Parameters.AddWithValue("@Strengths", result.Strengths);
                    
                    con.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }

        private class AnalysisResult
        {
            public decimal Score { get; set; }
            public string Matched { get; set; }
            public string Missing { get; set; }
            public string Suggestions { get; set; }
            public string Strengths { get; set; }
        }
    }
}
