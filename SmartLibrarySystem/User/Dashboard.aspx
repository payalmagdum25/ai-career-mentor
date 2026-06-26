<%@ Page Title="My Dashboard" Language="C#" MasterPageFile="~/User/User.master" AutoEventWireup="true" CodeFile="Dashboard.aspx.cs" Inherits="User_Dashboard" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    My Dashboard
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="HeaderContent" runat="server">
    Dashboard
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row g-4 mb-4">
        <!-- Stat Cards -->
        <div class="col-md-4">
            <div class="stat-card bg-primary text-white">
                <h6 class="text-white-50 text-uppercase fw-bold mb-2">Books Currently Issued</h6>
                <h2 class="fw-bold mb-0"><asp:Label ID="lblActiveIssues" runat="server" Text="0"></asp:Label></h2>
                <i class="fas fa-book-reader icon text-white"></i>
            </div>
        </div>
        <div class="col-md-4">
            <div class="stat-card bg-warning text-white">
                <h6 class="text-white-50 text-uppercase fw-bold mb-2">Pending Fines</h6>
                <h2 class="fw-bold mb-0">$<asp:Label ID="lblPendingFines" runat="server" Text="0.00"></asp:Label></h2>
                <i class="fas fa-money-bill icon text-white"></i>
            </div>
        </div>
        <div class="col-md-4">
            <div class="stat-card bg-success text-white">
                <h6 class="text-white-50 text-uppercase fw-bold mb-2">Total Books Read</h6>
                <h2 class="fw-bold mb-0"><asp:Label ID="lblTotalRead" runat="server" Text="0"></asp:Label></h2>
                <i class="fas fa-check-circle icon text-white"></i>
            </div>
        </div>
    </div>

    <!-- Active Issues Grid -->
    <div class="glass-panel p-4">
        <h5 class="fw-bold mb-4">My Active Issues</h5>
        <div class="table-responsive">
            <asp:GridView ID="gvIssues" runat="server" AutoGenerateColumns="False" CssClass="table table-hover align-middle" BorderWidth="0" GridLines="None" EmptyDataText="You have no active issues." OnRowCommand="gvIssues_RowCommand">
                <Columns>
                    <asp:BoundField DataField="Title" HeaderText="Book Title" />
                    <asp:BoundField DataField="IssueDate" HeaderText="Issued Date" DataFormatString="{0:yyyy-MM-dd}" />
                    <asp:BoundField DataField="DueDate" HeaderText="Due Date" DataFormatString="{0:yyyy-MM-dd}" />
                    <asp:TemplateField HeaderText="Status">
                        <ItemTemplate>
                            <span class='badge <%# Convert.ToDecimal(Eval("FineAmount")) > 0 ? "bg-danger" : "bg-success" %>'>
                                <%# Convert.ToDecimal(Eval("FineAmount")) > 0 ? "Overdue" : "Active" %>
                            </span>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Fine">
                        <ItemTemplate>
                            <span class="fw-bold text-danger"><%# Convert.ToDecimal(Eval("FineAmount")) > 0 ? "$" + Eval("FineAmount") : "-" %></span>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Action">
                        <ItemTemplate>
                            <asp:LinkButton ID="btnPayFine" runat="server" CssClass="btn btn-sm btn-outline-danger" CommandName="PayFine" CommandArgument='<%# Eval("FineID") %>' Visible='<%# Convert.ToDecimal(Eval("FineAmount")) > 0 %>'>Pay Fine</asp:LinkButton>
                        </ItemTemplate>
                    </asp:TemplateField>
                </Columns>
                <HeaderStyle CssClass="table-light text-muted text-uppercase" />
            </asp:GridView>
        </div>
    </div>
</asp:Content>
