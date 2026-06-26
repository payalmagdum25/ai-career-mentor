<%@ Page Title="Issue & Return Books" Language="C#" MasterPageFile="~/Admin/Admin.master" AutoEventWireup="true" CodeFile="IssueReturn.aspx.cs" Inherits="Admin_IssueReturn" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Issue & Return Books
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="HeaderContent" runat="server">
    Issue / Return Management
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row g-4">
        <!-- Issue Book Section -->
        <div class="col-md-6">
            <div class="glass-panel p-4 h-100">
                <h5 class="fw-bold mb-4 text-primary"><i class="fas fa-hand-holding-open me-2"></i>Issue a Book</h5>
                
                <asp:Label ID="lblIssueMsg" runat="server" CssClass="d-block mb-3 fw-bold"></asp:Label>

                <div class="mb-3">
                    <label class="form-label">Book ID</label>
                    <asp:TextBox ID="txtIssueBookID" runat="server" CssClass="form-control" TextMode="Number" placeholder="Enter Book ID"></asp:TextBox>
                </div>
                <div class="mb-3">
                    <label class="form-label">Student User ID</label>
                    <asp:TextBox ID="txtIssueUserID" runat="server" CssClass="form-control" TextMode="Number" placeholder="Enter Student ID"></asp:TextBox>
                </div>
                <div class="mb-4">
                    <label class="form-label">Issue Duration (Days)</label>
                    <asp:TextBox ID="txtDays" runat="server" CssClass="form-control" TextMode="Number" Text="15"></asp:TextBox>
                </div>
                
                <asp:Button ID="btnIssue" runat="server" Text="Issue Book" CssClass="btn btn-premium w-100" OnClick="btnIssue_Click" />
            </div>
        </div>

        <!-- Return Book Section -->
        <div class="col-md-6">
            <div class="glass-panel p-4 h-100">
                <h5 class="fw-bold mb-4 text-success"><i class="fas fa-undo me-2"></i>Return a Book</h5>
                
                <asp:Label ID="lblReturnMsg" runat="server" CssClass="d-block mb-3 fw-bold"></asp:Label>

                <div class="mb-4">
                    <label class="form-label">Issue ID</label>
                    <asp:TextBox ID="txtReturnIssueID" runat="server" CssClass="form-control" TextMode="Number" placeholder="Enter Issue ID"></asp:TextBox>
                    <small class="text-muted mt-2 d-block">Find the Issue ID from the active issues list.</small>
                </div>
                
                <asp:Button ID="btnReturn" runat="server" Text="Process Return" CssClass="btn btn-success w-100 py-2 fw-bold" OnClick="btnReturn_Click" style="border-radius: 8px;" />
            </div>
        </div>
    </div>
</asp:Content>
