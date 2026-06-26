<%@ Page Title="Catalog" Language="C#" MasterPageFile="~/User/User.master" AutoEventWireup="true" CodeFile="Catalog.aspx.cs" Inherits="User_Catalog" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Book Catalog
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="HeaderContent" runat="server">
    Browse Books
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <!-- Search Bar -->
    <div class="row justify-content-center mb-5">
        <div class="col-md-8">
            <div class="input-group input-group-lg shadow-sm">
                <span class="input-group-text bg-white border-end-0"><i class="fas fa-search text-muted"></i></span>
                <asp:TextBox ID="txtSearch" runat="server" CssClass="form-control border-start-0 py-3" placeholder="Search for books by title, author, or category..."></asp:TextBox>
                <asp:Button ID="btnSearch" runat="server" Text="Search" CssClass="btn btn-premium px-4" OnClick="btnSearch_Click" />
            </div>
        </div>
    </div>

    <!-- Filter Buttons -->
    <div class="d-flex justify-content-center gap-2 mb-5 flex-wrap">
        <button type="button" class="btn btn-outline-primary active rounded-pill px-4">All</button>
        <button type="button" class="btn btn-outline-primary rounded-pill px-4">Computer Science</button>
        <button type="button" class="btn btn-outline-primary rounded-pill px-4">Fiction</button>
        <button type="button" class="btn btn-outline-primary rounded-pill px-4">Science</button>
    </div>

    <!-- Books Grid -->
    <div class="row g-4">
        <asp:Repeater ID="rptBooks" runat="server">
            <ItemTemplate>
                <div class="col-md-4 col-lg-3">
                    <div class="glass-panel h-100 d-flex flex-column stat-card p-0 overflow-hidden">
                        <div class="bg-light p-0 text-center" style="height: 250px; overflow: hidden;">
                            <img src='<%# string.IsNullOrEmpty(Eval("CoverImage").ToString()) ? "https://via.placeholder.com/400x600?text=No+Cover" : Eval("CoverImage") %>' alt="Cover" class="w-100 h-100" style="object-fit: cover; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" />
                        </div>
                        <div class="p-4 d-flex flex-column flex-grow-1">
                            <span class="badge bg-primary bg-opacity-10 text-primary w-auto align-self-start mb-2"><%# Eval("CategoryName") %></span>
                            <h5 class="fw-bold text-truncate" title='<%# Eval("Title") %>'><%# Eval("Title") %></h5>
                            <p class="text-muted small mb-3"><i class="fas fa-pen-nib me-1"></i> <%# Eval("AuthorName") %></p>
                            
                            <div class="mt-auto d-flex justify-content-between align-items-center">
                                <span class="fw-bold <%# Convert.ToInt32(Eval("AvailableCopies")) > 0 ? "text-success" : "text-danger" %>">
                                    <%# Convert.ToInt32(Eval("AvailableCopies")) > 0 ? "Available (" + Eval("AvailableCopies") + ")" : "Out of Stock" %>
                                </span>
                                <asp:LinkButton ID="btnReserve" runat="server" CssClass="btn btn-sm btn-premium" CommandArgument='<%# Eval("BookID") %>' OnClick="btnReserve_Click" Enabled='<%# Convert.ToInt32(Eval("AvailableCopies")) > 0 %>'>
                                    Reserve
                                </asp:LinkButton>
                            </div>
                        </div>
                    </div>
                </div>
            </ItemTemplate>
        </asp:Repeater>
    </div>
</asp:Content>
