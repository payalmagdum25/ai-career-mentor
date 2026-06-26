<%@ Page Title="Manage Books" Language="C#" MasterPageFile="~/Admin/Admin.master" AutoEventWireup="true" CodeFile="ManageBooks.aspx.cs" Inherits="Admin_ManageBooks" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Manage Books
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="HeaderContent" runat="server">
    Book Inventory
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <div class="d-flex justify-content-between mb-4">
        <div class="input-group w-50">
            <span class="input-group-text bg-transparent border-end-0"><i class="fas fa-search"></i></span>
            <asp:TextBox ID="txtSearch" runat="server" CssClass="form-control border-start-0" placeholder="Search by title, author, or ISBN..."></asp:TextBox>
            <asp:Button ID="btnSearch" runat="server" Text="Search" CssClass="btn btn-primary" OnClick="btnSearch_Click" />
        </div>
        <button type="button" class="btn btn-premium" data-bs-toggle="modal" data-bs-target="#addBookModal">
            <i class="fas fa-plus me-2"></i> Add New Book
        </button>
    </div>

    <div class="table-responsive glass-panel p-3">
        <asp:GridView ID="gvBooks" runat="server" AutoGenerateColumns="False" CssClass="table table-hover align-middle datatable" BorderWidth="0" GridLines="None" EmptyDataText="No books found." UseAccessibleHeader="true">
            <Columns>
                <asp:TemplateField HeaderText="Cover">
                    <ItemTemplate>
                        <img src='<%# string.IsNullOrEmpty(Eval("CoverImage").ToString()) ? "https://via.placeholder.com/40x60?text=No+Cover" : Eval("CoverImage") %>' alt="Cover" class="rounded shadow-sm" style="width: 40px; height: 60px; object-fit: cover;" />
                    </ItemTemplate>
                </asp:TemplateField>
                <asp:BoundField DataField="BookID" HeaderText="ID" />
                <asp:BoundField DataField="Title" HeaderText="Title" />
                <asp:BoundField DataField="ISBN" HeaderText="ISBN" />
                <asp:BoundField DataField="CategoryName" HeaderText="Category" />
                <asp:BoundField DataField="AuthorName" HeaderText="Author" />
                <asp:BoundField DataField="TotalCopies" HeaderText="Total" />
                <asp:BoundField DataField="AvailableCopies" HeaderText="Available" />
                <asp:TemplateField HeaderText="Actions">
                    <ItemTemplate>
                        <asp:LinkButton ID="btnEdit" runat="server" CssClass="btn btn-sm btn-outline-primary rounded-circle"><i class="fas fa-edit"></i></asp:LinkButton>
                        <asp:LinkButton ID="btnDelete" runat="server" CssClass="btn btn-sm btn-outline-danger rounded-circle"><i class="fas fa-trash"></i></asp:LinkButton>
                    </ItemTemplate>
                </asp:TemplateField>
            </Columns>
            <HeaderStyle CssClass="table-light text-muted fw-bold text-uppercase" />
        </asp:GridView>
    </div>

    <!-- Add Book Modal -->
    <div class="modal fade" id="addBookModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content glass-panel">
                <div class="modal-header border-bottom border-light">
                    <h5 class="modal-title fw-bold">Add New Book</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Title</label>
                        <asp:TextBox ID="txtNewTitle" runat="server" CssClass="form-control"></asp:TextBox>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">ISBN</label>
                        <asp:TextBox ID="txtNewISBN" runat="server" CssClass="form-control"></asp:TextBox>
                    </div>
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Category ID (1-4)</label>
                            <asp:TextBox ID="txtCatID" runat="server" CssClass="form-control" TextMode="Number"></asp:TextBox>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Author ID (1-3)</label>
                            <asp:TextBox ID="txtAuthID" runat="server" CssClass="form-control" TextMode="Number"></asp:TextBox>
                        </div>
                    </div>
                    <div class="row g-3 mb-3">
                        <div class="col-md-4">
                            <label class="form-label">Total Copies</label>
                            <asp:TextBox ID="txtCopies" runat="server" CssClass="form-control" TextMode="Number"></asp:TextBox>
                        </div>
                        <div class="col-md-8">
                            <label class="form-label">Cover Image URL</label>
                            <asp:TextBox ID="txtCoverUrl" runat="server" CssClass="form-control" placeholder="https://..."></asp:TextBox>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-top border-light">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <asp:Button ID="btnAddBook" runat="server" Text="Save Book" CssClass="btn btn-premium" OnClick="btnAddBook_Click" />
                </div>
            </div>
        </div>
    </div>

    <!-- DataTables Init Script -->
    <script>
        $(document).ready(function () {
            if ($('.datatable tbody tr').length > 0 && !$('.datatable tbody tr td').hasClass('empty')) {
                $('.datatable').DataTable({
                    "pageLength": 5,
                    "lengthMenu": [5, 10, 25, 50],
                    "language": {
                        "search": "Filter Records:"
                    }
                });
            }
        });
    </script>
</asp:Content>
