<%@ Page Title="Home" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Home
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="container-fluid p-0">
        <!-- Hero Section -->
        <section class="d-flex align-items-center" style="min-height: 100vh; background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);">
            <div class="container text-center animate-fade-in">
                <h1 class="display-3 fw-bold mb-4" style="background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                    Welcome to Smart Library
                </h1>
                <p class="lead text-muted mb-5 max-w-2xl mx-auto" style="max-width: 600px;">
                    Experience the future of library management. Browse thousands of books, reserve your favorites, and manage your issues effortlessly with our modern, premium platform.
                </p>
                <div class="d-flex gap-3 justify-content-center">
                    <a href="Register.aspx" class="btn btn-premium btn-lg px-5">Join Now</a>
                    <a href="Login.aspx" class="btn btn-outline-primary btn-lg px-5" style="border-radius: 8px;">Login</a>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="py-5 bg-color">
            <div class="container py-5">
                <div class="row g-4 text-center">
                    <div class="col-md-4">
                        <div class="glass-panel p-5 stat-card h-100">
                            <i class="fas fa-search text-primary fs-1 mb-4"></i>
                            <h3 class="fw-bold h4 mb-3">Smart Search</h3>
                            <p class="text-muted mb-0">Instantly find books by title, author, or category with our real-time search engine.</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="glass-panel p-5 stat-card h-100">
                            <i class="fas fa-bolt text-warning fs-1 mb-4"></i>
                            <h3 class="fw-bold h4 mb-3">Real-time Updates</h3>
                            <p class="text-muted mb-0">Get instant notifications about book availability, due dates, and fine calculations.</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="glass-panel p-5 stat-card h-100">
                            <i class="fas fa-mobile-alt text-success fs-1 mb-4"></i>
                            <h3 class="fw-bold h4 mb-3">Fully Responsive</h3>
                            <p class="text-muted mb-0">Access the library from anywhere. Our platform is perfectly optimized for all devices.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</asp:Content>
