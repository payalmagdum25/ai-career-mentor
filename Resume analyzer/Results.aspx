<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Results.aspx.cs" Inherits="ResumeAnalyzer.Results" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>AI Analysis Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet" />
    <style>
        body {
            font-family: 'Outfit', sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
            color: #f8fafc;
            margin: 0;
            padding: 40px 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: auto;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
        }

        h1 {
            font-weight: 800;
            font-size: 2.5rem;
            margin: 0;
            background: linear-gradient(to right, #a855f7, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .back-link {
            color: #c084fc;
            text-decoration: none;
            font-weight: 600;
            padding: 10px 20px;
            border: 1px solid rgba(192, 132, 252, 0.3);
            border-radius: 8px;
            transition: all 0.3s;
        }

        .back-link:hover {
            background: rgba(192, 132, 252, 0.1);
        }

        .gridview-wrapper {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.95rem;
        }

        th {
            background: rgba(255, 255, 255, 0.05);
            color: #e2e8f0;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 0.05em;
            padding: 16px;
            text-align: left;
            border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        }

        td {
            padding: 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            color: #cbd5e1;
            vertical-align: top;
        }

        tr:hover td {
            background: rgba(255, 255, 255, 0.02);
        }

        .score-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: 800;
            font-size: 0.9rem;
        }

        .score-high { background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); }
        .score-med { background: rgba(234, 179, 8, 0.15); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.3); }
        .score-low { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }

        .feedback-box {
            background: rgba(0,0,0,0.2);
            padding: 15px;
            border-radius: 10px;
            font-size: 0.85rem;
            line-height: 1.6;
            max-width: 320px;
        }
        
        .feedback-box ul { margin: 8px 0 0 20px; padding: 0; }
        .feedback-box li { margin-bottom: 8px; }
        
        .feedback-strengths { border-left: 4px solid #4ade80; margin-bottom: 12px; background: rgba(74, 222, 128, 0.05); }
        .feedback-suggestions { border-left: 4px solid #facc15; background: rgba(250, 204, 21, 0.05); }

        .feedback-header {
            display: flex;
            align-items: center;
            font-weight: 700;
            font-size: 0.95rem;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .feedback-strengths .feedback-header { color: #4ade80; }
        .feedback-suggestions .feedback-header { color: #facc15; }

        .skill-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 600;
            margin: 2px;
        }

        .skill-badge.missing { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
        .skill-badge.empty { background: rgba(255, 255, 255, 0.1); color: #cbd5e1; border: 1px solid rgba(255, 255, 255, 0.2); }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="container">
            <div class="header">
                <h1>AI Analysis Dashboard</h1>
                <a href="Default.aspx" class="back-link">&larr; Upload Another</a>
            </div>
            
            <div class="gridview-wrapper">
                <asp:GridView ID="gvResults" runat="server" AutoGenerateColumns="False" BorderStyle="None" GridLines="None" OnRowDataBound="gvResults_RowDataBound">
                    <Columns>
                        <asp:BoundField DataField="CandidateName" HeaderText="Candidate" />
                        <asp:BoundField DataField="UploadDate" HeaderText="Date" DataFormatString="{0:MMM dd, yyyy}" />
                        
                        <asp:TemplateField HeaderText="ATS Score">
                            <ItemTemplate>
                                <asp:Label ID="lblScore" runat="server" Text='<%# Eval("MatchScore") + "%" %>'></asp:Label>
                            </ItemTemplate>
                        </asp:TemplateField>

                        <asp:TemplateField HeaderText="Insights & Feedback">
                            <ItemTemplate>
                                <div class="feedback-box feedback-strengths">
                                    <div class="feedback-header">✓ Core Strengths</div>
                                    <%# Eval("Strengths") %>
                                </div>
                                <div class="feedback-box feedback-suggestions">
                                    <div class="feedback-header">⚡ Areas for Improvement</div>
                                    <%# Eval("Suggestions") %>
                                </div>
                            </ItemTemplate>
                        </asp:TemplateField>

                        <asp:TemplateField HeaderText="Missing Skills">
                            <ItemTemplate>
                                <%# FormatMissingSkills(Eval("MissingKeywords")) %>
                            </ItemTemplate>
                        </asp:TemplateField>
                    </Columns>
                </asp:GridView>
            </div>
        </div>
    </form>
</body>
</html>
