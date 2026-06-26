<%@ Page Title="My Books" Language="C#" MasterPageFile="~/User/User.master" AutoEventWireup="true" CodeFile="MyBooks.aspx.cs" Inherits="User_MyBooks" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    My Books
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="HeaderContent" runat="server">
    My Library History
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row text-center">
        <div class="col-md-12 py-5">
            <i class="fas fa-book-reader fa-4x text-muted mb-4 opacity-50"></i>
            <h3 class="fw-bold text-muted">Complete Reading History</h3>
            <p class="text-muted">Here you will find a complete history of all the books you have ever issued, returned, or reserved. <br /> (Data grid coming soon!)</p>
            
            <a href="Catalog.aspx" class="btn btn-premium mt-4 px-4">Go to Catalog</a>
        </div>
    </div>
</asp:Content>
