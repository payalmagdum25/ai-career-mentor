<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Register.aspx.cs" Inherits="Register" %>

<!DOCTYPE html>
<html lang="en">
<head runat="server">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Premium Register - Smart Library Enterprise</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --primary: #4F46E5;
            --secondary: #10B981;
            --dark: #0F172A;
        }

        body {
            font-family: 'Outfit', sans-serif;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            background: linear-gradient(-45deg, #0F172A, #1E1B4B, #312E81, #0F172A);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        #particles-js {
            position: fixed;
            width: 100%;
            height: 100%;
            z-index: 1;
        }

        .auth-wrapper {
            position: relative;
            z-index: 2;
            width: 100%;
            padding: 2rem;
        }

        .glass-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 3rem;
            width: 100%;
            max-width: 550px;
            margin: 0 auto;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            color: white;
            /* GSAP initial state */
            opacity: 0;
            transform: scale(0.9);
        }

        .form-control-glass {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            border-radius: 12px;
            padding: 0.75rem 1.25rem;
            transition: all 0.3s ease;
        }

        .form-control-glass:focus {
            background: rgba(255, 255, 255, 0.1);
            border-color: var(--secondary);
            box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.25);
            color: white;
        }
        
        .form-control-glass::placeholder {
            color: rgba(255,255,255,0.4);
        }

        .btn-premium {
            background: linear-gradient(135deg, var(--secondary), #34D399);
            border: none;
            color: white;
            border-radius: 12px;
            padding: 0.85rem;
            font-weight: 600;
            font-size: 1.1rem;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .btn-premium:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px -10px var(--secondary);
        }

        .btn-premium::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
            transform: skewX(-25deg);
            transition: all 0.75s ease;
        }

        .btn-premium:hover::after {
            left: 200%;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div id="particles-js"></div>

        <div class="auth-wrapper">
            <div class="glass-card" id="registerCard">
                <div class="text-center mb-4">
                    <h2 class="fw-bold mb-1">Create Account</h2>
                    <p class="text-white-50">Join the ultimate digital library platform</p>
                </div>

                <asp:Label ID="lblMessage" runat="server" CssClass="d-block mb-3 text-center fw-bold"></asp:Label>

                <div class="row g-3 mb-3">
                    <div class="col-md-12">
                        <label class="form-label text-white-50 small fw-bold">Full Name</label>
                        <asp:TextBox ID="txtName" runat="server" CssClass="form-control form-control-glass" placeholder="John Doe"></asp:TextBox>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label text-white-50 small fw-bold">Email Address</label>
                    <asp:TextBox ID="txtEmail" runat="server" CssClass="form-control form-control-glass" placeholder="name@domain.com" TextMode="Email"></asp:TextBox>
                </div>

                <div class="mb-3">
                    <label class="form-label text-white-50 small fw-bold">Phone Number</label>
                    <asp:TextBox ID="txtPhone" runat="server" CssClass="form-control form-control-glass" placeholder="+1 (555) 000-0000"></asp:TextBox>
                </div>

                <div class="row g-3 mb-4">
                    <div class="col-md-6">
                        <label class="form-label text-white-50 small fw-bold">Password</label>
                        <asp:TextBox ID="txtPassword" runat="server" CssClass="form-control form-control-glass" placeholder="••••••••" TextMode="Password"></asp:TextBox>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label text-white-50 small fw-bold">Confirm Password</label>
                        <asp:TextBox ID="txtConfirm" runat="server" CssClass="form-control form-control-glass" placeholder="••••••••" TextMode="Password"></asp:TextBox>
                    </div>
                </div>

                <asp:Button ID="btnRegister" runat="server" Text="Create Account" CssClass="btn btn-premium w-100 mb-4" OnClick="btnRegister_Click" />

                <div class="text-center">
                    <p class="text-white-50 small mb-0">Already have an account? <a href="Login.aspx" class="text-white fw-bold text-decoration-none ms-1">Sign in here</a></p>
                </div>
            </div>
        </div>
    </form>

    <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    
    <script>
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#10B981" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.4, "random": true },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#10B981", "opacity": 0.2, "width": 1 },
                "move": { "enable": true, "speed": 1.5, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
                    "push": { "particles_nb": 4 }
                }
            },
            "retina_detect": true
        });

        document.addEventListener("DOMContentLoaded", (event) => {
            gsap.to("#registerCard", {
                scale: 1,
                opacity: 1,
                duration: 1,
                ease: "back.out(1.7)",
                delay: 0.1
            });
        });
    </script>
</body>
</html>
