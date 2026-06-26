<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="ResumeAnalyzer.Default" Async="true" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8" />
    <title>AI Resume Analyzer</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet" />
    <style>
        body {
            font-family: 'Outfit', sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
            color: #f8fafc;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .glass-panel {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 40px;
            width: 100%;
            max-width: 600px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            transition: transform 0.3s ease;
        }

        .glass-panel:hover {
            transform: translateY(-5px);
        }

        h1 {
            text-align: center;
            font-weight: 800;
            font-size: 2.5rem;
            margin-bottom: 10px;
            background: linear-gradient(to right, #a855f7, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        p.subtitle {
            text-align: center;
            color: #94a3b8;
            margin-bottom: 30px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #cbd5e1;
            font-size: 0.95rem;
        }

        input[type="text"], textarea, input[type="file"] {
            width: 100%;
            padding: 14px 16px;
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: white;
            font-family: 'Outfit', sans-serif;
            font-size: 1rem;
            box-sizing: border-box;
            transition: all 0.3s ease;
        }

        input[type="text"]:focus, textarea:focus {
            outline: none;
            border-color: #a855f7;
            box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
        }

        input[type="file"] {
            padding: 10px;
            cursor: pointer;
        }
        
        input[type="file"]::file-selector-button {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            margin-right: 16px;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        input[type="file"]::file-selector-button:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .btn-glow {
            width: 100%;
            padding: 16px;
            border: none;
            border-radius: 12px;
            background: linear-gradient(to right, #8b5cf6, #d946ef);
            color: white;
            font-weight: bold;
            font-size: 1.1rem;
            cursor: pointer;
            box-shadow: 0 10px 20px -10px rgba(217, 70, 239, 0.5);
            transition: all 0.3s ease;
            margin-top: 10px;
        }

        .btn-glow:hover {
            transform: scale(1.02);
            box-shadow: 0 15px 25px -10px rgba(217, 70, 239, 0.7);
        }

        .message {
            margin-top: 20px;
            text-align: center;
            font-weight: 600;
            padding: 12px;
            border-radius: 8px;
        }

        .success { background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); }
        .error { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); }

        .nav-links {
            text-align: center;
            margin-top: 25px;
        }

        .nav-links a {
            color: #c084fc;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s;
        }

        .nav-links a:hover {
            color: #f0abfc;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="glass-panel">
            <h1>AI Resume Analyzer</h1>
            <p class="subtitle">Upload a resume for deep semantic analysis and ATS scoring.</p>
            
            <div class="form-group">
                <label>Candidate Name</label>
                <asp:TextBox ID="txtCandidateName" runat="server" required="true" placeholder="e.g. John Doe"></asp:TextBox>
            </div>
            
            <div class="form-group">
                <label>Target Keywords / Job Description</label>
                <asp:TextBox ID="txtKeywords" runat="server" TextMode="MultiLine" Rows="4" placeholder="Paste the job description or required skills here..."></asp:TextBox>
            </div>
            
            <div class="form-group">
                <label>Resume (PDF format)</label>
                <asp:FileUpload ID="fuResume" runat="server" accept=".pdf" required="true" />
            </div>
            
            <asp:Button ID="btnUpload" runat="server" Text="Analyze with AI" CssClass="btn-glow" OnClick="btnUpload_Click" />
            
            <asp:Panel ID="pnlMessage" runat="server" Visible="false" CssClass="message">
                <asp:Label ID="lblMessage" runat="server"></asp:Label>
            </asp:Panel>
            
            <div class="nav-links">
                <a href="Results.aspx">View Dashboard & Detailed Insights &rarr;</a>
            </div>
        </div>
    </form>
</body>
</html>
