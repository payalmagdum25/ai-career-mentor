import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import LandingLayout from './layouts/LandingLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Protection Helper
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ResumePage from './pages/ResumePage';
import ChatPage from './pages/ChatPage';
import InterviewPage from './pages/InterviewPage';
import CodePage from './pages/CodePage';
import RoadmapPage from './pages/RoadmapPage';
import JobMatcherPage from './pages/JobMatcherPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Visitor Routes */}
            <Route path="/" element={<LandingLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* Secure Dashboard Student Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="resume" element={<ResumePage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="interview" element={<InterviewPage />} />
              <Route path="code" element={<CodePage />} />
              <Route path="roadmap" element={<RoadmapPage />} />
              <Route path="jobs" element={<JobMatcherPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Fallback redirect */}
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
