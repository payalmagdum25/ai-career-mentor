import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const LandingLayout = () => {
  const { user } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const handleNavClick = (sectionId) => {
    // If we're not on the home page, go to home page first
    if (window.location.pathname !== '/') {
      navigate('/' + sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      {/* Sticky Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light fixed-top glass-nav px-lg-5 py-3">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <i className="bi-cpu text-primary fs-3 me-2"></i>
            <span className="fw-bold fs-4 text-primary" style={{ fontFamily: 'Outfit' }}>
              AI Career Mentor
            </span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-3">
              <li className="nav-item">
                <button className="nav-link btn btn-link border-0 text-secondary" onClick={() => handleNavClick('hero')}>
                  Home
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link border-0 text-secondary" onClick={() => handleNavClick('features')}>
                  Features
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link border-0 text-secondary" onClick={() => handleNavClick('about')}>
                  About
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link border-0 text-secondary" onClick={() => handleNavClick('contact')}>
                  Contact
                </button>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-3">
              {/* Theme Toggle */}
              <button className="btn btn-glass p-2 border-0" onClick={toggleTheme} title="Toggle Theme">
                <i className={`bi ${isDark ? 'bi-sun text-warning' : 'bi-moon text-dark'} fs-5`}></i>
              </button>

              {user ? (
                <Link to="/dashboard" className="btn btn-gradient">
                  Go to Dashboard <i className="bi-arrow-right ms-1"></i>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-glass">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-gradient">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Page Content */}
      <div style={{ paddingTop: '80px' }}>
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="py-5 border-top border-secondary border-opacity-10 mt-5 bg-secondary bg-opacity-5">
        <div className="container px-4">
          <div className="row g-4 justify-content-between">
            <div className="col-lg-4">
              <div className="d-flex align-items-center mb-3">
                <i className="bi-cpu text-primary fs-3 me-2"></i>
                <span className="fw-bold fs-4 text-primary" style={{ fontFamily: 'Outfit' }}>
                  AI Career Mentor
                </span>
              </div>
              <p className="text-secondary small">
                Empowering students and job seekers with modern artificial intelligence to build resumes, clear interviews, practice code, and land dream roles.
              </p>
            </div>
            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="fw-bold mb-3">Resources</h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small">
                <li><Link to="/login" className="text-secondary text-decoration-none">AI Resume Analyzer</Link></li>
                <li><Link to="/login" className="text-secondary text-decoration-none">Mock Interview Room</Link></li>
                <li><Link to="/login" className="text-secondary text-decoration-none">Roadmap Checklists</Link></li>
              </ul>
            </div>
            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="fw-bold mb-3">Company</h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small">
                <li><a href="#about" className="text-secondary text-decoration-none">About Us</a></li>
                <li><a href="#features" className="text-secondary text-decoration-none">Features</a></li>
                <li><a href="#contact" className="text-secondary text-decoration-none">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <hr className="my-4 opacity-10" />
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <span className="text-secondary small">© 2026 AI Career Mentor. All rights reserved.</span>
            <div className="d-flex gap-3">
              <a href="#" className="text-secondary"><i className="bi-github fs-5"></i></a>
              <a href="#" className="text-secondary"><i className="bi-linkedin fs-5"></i></a>
              <a href="#" className="text-secondary"><i className="bi-twitter-x fs-5"></i></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;
