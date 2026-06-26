<%@ Page Title="Dashboard" Language="C#" MasterPageFile="~/Admin/Admin.master" AutoEventWireup="true" CodeFile="Dashboard.aspx.cs" Inherits="Admin_Dashboard" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Admin Dashboard
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="HeaderContent" runat="server">
    Dashboard Overview
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row g-4 mb-4">
        <!-- Stat Cards -->
        <div class="col-md-3">
            <div class="stat-card bg-primary text-white">
                <h6 class="text-white-50 text-uppercase fw-bold mb-2">Total Books</h6>
                <h2 class="fw-bold mb-0"><span class="counter-value" data-target="1542">0</span></h2>
                <i class="fas fa-book icon text-white"></i>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card bg-success text-white">
                <h6 class="text-white-50 text-uppercase fw-bold mb-2">Total Students</h6>
                <h2 class="fw-bold mb-0"><span class="counter-value" data-target="856">0</span></h2>
                <i class="fas fa-users icon text-white"></i>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card bg-warning text-white">
                <h6 class="text-white-50 text-uppercase fw-bold mb-2">Active Issues</h6>
                <h2 class="fw-bold mb-0"><span class="counter-value" data-target="124">0</span></h2>
                <i class="fas fa-hand-holding-open icon text-white"></i>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card bg-danger text-white">
                <h6 class="text-white-50 text-uppercase fw-bold mb-2">Pending Fines</h6>
                <h2 class="fw-bold mb-0">$<span class="counter-value" data-target="350">0</span></h2>
                <i class="fas fa-money-bill-wave icon text-white"></i>
            </div>
        </div>
    </div>

    <!-- Charts Row -->
    <div class="row g-4">
        <div class="col-md-8">
            <div class="glass-panel p-4 h-100">
                <h5 class="fw-bold mb-4">Issue vs Return Analytics</h5>
                <canvas id="mainChart" height="100"></canvas>
            </div>
        </div>
        <div class="col-md-4">
            <div class="glass-panel p-4 h-100">
                <h5 class="fw-bold mb-4">Books by Category</h5>
                <canvas id="pieChart" height="200"></canvas>
            </div>
        </div>
    </div>
</asp:Content>

<asp:Content ID="Content4" ContentPlaceHolderID="ScriptsContent" runat="server">
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            // Main Line Chart
            const ctx1 = document.getElementById('mainChart').getContext('2d');
            new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Books Issued',
                        data: [65, 59, 80, 81, 56, 55],
                        borderColor: '#4F46E5',
                        tension: 0.4,
                        fill: true,
                        backgroundColor: 'rgba(79, 70, 229, 0.1)'
                    }, {
                        label: 'Books Returned',
                        data: [45, 49, 60, 71, 46, 50],
                        borderColor: '#10B981',
                        tension: 0.4,
                        fill: true,
                        backgroundColor: 'rgba(16, 185, 129, 0.1)'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'bottom' } }
                }
            });

            // Pie Chart
            const ctx2 = document.getElementById('pieChart').getContext('2d');
            new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: ['Computer Science', 'Fiction', 'Science', 'History'],
                    datasets: [{
                        data: [40, 20, 25, 15],
                        backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'bottom' } },
                    cutout: '70%'
                }
            });
        });
    </script>
</asp:Content>
