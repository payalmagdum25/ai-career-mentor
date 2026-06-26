<%@ Page Title="Reports" Language="C#" MasterPageFile="~/Admin/Admin.master" AutoEventWireup="true" CodeFile="Reports.aspx.cs" Inherits="Admin_Reports" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Reports
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="HeaderContent" runat="server">
    System Reports
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row text-center">
        <div class="col-md-12 py-5">
            <i class="fas fa-file-invoice fa-4x text-muted mb-4 opacity-50"></i>
            <h3 class="fw-bold text-muted">Advanced Reporting Module</h3>
            <p class="text-muted">This module allows you to export Data to Excel/PDF and view fine calculations. <br /> Currently under construction for the next phase!</p>
            
            <a href="Dashboard.aspx" class="btn btn-outline-primary mt-4 px-4">Back to Dashboard</a>
        </div>
    </div>
</asp:Content>
