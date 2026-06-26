<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Login.aspx.cs" Inherits="Login" %>

<!DOCTYPE html>
<html lang="en">
<head runat="server">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Premium Login - Smart Library Enterprise</title>
    
    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
    <!-- Google Fonts -->
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
            height: 100vh;
            overflow: hidden;
            background: linear-gradient(-45deg, #0F172A, #1E1B4B, #312E81, #0F172A);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
        }

        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        #particles-js {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 1;
        }

        .auth-wrapper {
            position: relative;
            z-index: 2;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .glass-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 3rem;
            width: 100%;
            max-width: 450px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            color: white;
            /* GSAP initial state */
            opacity: 0;
            transform: translateY(50px);
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
            border-color: var(--primary);
            box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.25);
            color: white;
        }
        
        .form-control-glass::placeholder {
            color: rgba(255,255,255,0.5);
        }

        .btn-premium {
            background: linear-gradient(135deg, var(--primary), #818CF8);
            border: none;
            color: white;
            border-radius: 12px;
            padding: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .btn-premium:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px -10px var(--primary);
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

        .brand-logo {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin: 0 auto 1.5rem;
            box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.5);
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <!-- Particles Background -->
        <div id="particles-js"></div>

        <div class="auth-wrapper">
            <div class="glass-card" id="loginCard">
                <div class="text-center">
                    <div class="brand-logo">
                        <i class="fas fa-book-reader text-white"></i>
                    </div>
                    <h3 class="fw-bold mb-1">Welcome Back</h3>
                    <p class="text-white-50 mb-4">Enter your credentials to access the portal</p>
                </div>

                <asp:Label ID="lblMessage" runat="server" CssClass="d-block mb-3 text-center fw-bold text-danger"></asp:Label>

                <div class="mb-4 position-relative">
                    <label class="form-label text-white-50 small fw-bold">Email Address</label>
                    <div class="input-group">
                        <span class="input-group-text bg-transparent border-0 position-absolute text-white-50" style="z-index: 5; left: 5px; top: 8px;">
                            <i class="fas fa-envelope"></i>
                        </span>
                        <asp:TextBox ID="txtEmail" runat="server" CssClass="form-control form-control-glass ps-5" placeholder="name@domain.com" TextMode="Email"></asp:TextBox>
                    </div>
                </div>

                <div class="mb-4 position-relative">
                    <div class="d-flex justify-content-between">
                        <label class="form-label text-white-50 small fw-bold">Password</label>
                        <a href="#" class="text-primary text-decoration-none small fw-bold">Forgot?</a>
                    </div>
                    <div class="input-group">
                        <span class="input-group-text bg-transparent border-0 position-absolute text-white-50" style="z-index: 5; left: 5px; top: 8px;">
                            <i class="fas fa-lock"></i>
                        </span>
                        <asp:TextBox ID="txtPassword" runat="server" CssClass="form-control form-control-glass ps-5" placeholder="••••••••" TextMode="Password"></asp:TextBox>
                    </div>
                </div>

                <div class="mb-4 form-check">
                    <asp:CheckBox ID="chkRemember" runat="server" CssClass="form-check-input" />
                    <label class="form-check-label text-white-50 small">Remember me for 30 days</label>
                </div>

                <asp:Button ID="btnLogin" runat="server" Text="Sign In securely" CssClass="btn btn-premium w-100 mb-4" OnClick="btnLogin_Click" />

                <div class="text-center">
                    <p class="text-white-50 small mb-0">Don't have an account? <a href="Register.aspx" class="text-white fw-bold text-decoration-none ms-1">Register now</a></p>
                </div>
            </div>
        </div>
    </form>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    
    <script>
        // Initialize Particles
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#ffffff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.3, "random": true },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.2, "width": 1 },
                "move": { "enable": true, "speed": 2, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false }
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

        // GSAP Animations
        document.addEventListener("DOMContentLoaded", (event) => {
            gsap.to("#loginCard", {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power4.out",
                delay: 0.2
            });
            
            // Subtle floating animation for the card
            gsap.to("#loginCard", {
                y: -10,
                duration: 3,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                delay: 1.4
            });
        });
    </script>
</body>
</html>
