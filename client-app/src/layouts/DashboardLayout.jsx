import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { profileApi } from '../services/api';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await profileApi.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await profileApi.markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'bi-grid' },
    { name: 'Resume Analyzer', path: '/dashboard/resume', icon: 'bi-file-earmark-person' },
    { name: 'AI Career Chat', path: '/dashboard/chat', icon: 'bi-chat-quote' },
    { name: 'Mock Interviews', path: '/dashboard/interview', icon: 'bi-people' },
    { name: 'Coding Practice', path: '/dashboard/code', icon: 'bi-code-slash' },
    { name: 'Learning Roadmap', path: '/dashboard/roadmap', icon: 'bi-compass' },
    { name: 'Job Matcher', path: '/dashboard/jobs', icon: 'bi-briefcase' },
    { name: 'Profile Settings', path: '/dashboard/profile', icon: 'bi-gear' },
  ];

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Sidebar */}
      <aside
        className={`glass-card m-3 d-flex flex-column transition-all`}
        style={{
          width: sidebarCollapsed ? '80px' : '260px',
          minWidth: sidebarCollapsed ? '80px' : '260px',
          height: 'calc(100vh - 2rem)',
          position: 'sticky',
          top: '1rem',
          zIndex: 1000,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {/* Brand */}
        <div className="p-4 d-flex align-items-center justify-content-between">
          {!sidebarCollapsed && (
            <Link to="/dashboard" className="text-decoration-none d-flex align-items-center">
              <i className="bi-cpu text-primary fs-3 me-2"></i>
              <span className="fw-bold fs-5 text-primary" style={{ fontFamily: 'Outfit' }}>
                AI Mentor
              </span>
            </Link>
          )}
          {sidebarCollapsed && <i className="bi-cpu text-primary fs-3 mx-auto"></i>}
          
          <button
            className="btn btn-sm btn-link text-secondary d-none d-md-block"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <i className={`bi ${sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
          </button>
        </div>

        {/* Menu Navigation */}
        <ul className="nav nav-pills flex-column mb-auto px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path} className="nav-item my-1">
                <Link
                  to={item.path}
                  className={`nav-link d-flex align-items-center px-3 py-2 ${
                    isActive ? 'active btn-gradient' : 'text-secondary'
                  }`}
                  style={{
                    borderRadius: '0.5rem',
                    transition: 'all 0.2s',
                    background: isActive ? 'var(--accent-gradient)' : 'transparent',
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                  }}
                >
                  <i className={`bi ${item.icon} fs-5 me-3`}></i>
                  {!sidebarCollapsed && <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* User Card */}
        <div className="p-3 border-top border-secondary border-opacity-10 mt-auto">
          <div className="d-flex align-items-center">
            <img
              src={user?.profileImage || 'https://api.dicebear.com/7.x/adventurer/svg?seed=avatar'}
              alt="Avatar"
              className="rounded-circle border border-2 border-primary me-2"
              width="40"
              height="40"
            />
            {!sidebarCollapsed && (
              <div className="overflow-hidden" style={{ maxWidth: '140px' }}>
                <p className="mb-0 fw-semibold text-truncate" style={{ fontSize: '0.9rem' }}>
                  {user?.name}
                </p>
                <span className="text-secondary text-truncate" style={{ fontSize: '0.75rem' }}>
                  {user?.role}
                </span>
              </div>
            )}
            {!sidebarCollapsed && (
              <button className="btn btn-sm text-danger ms-auto" onClick={handleLogout} title="Log Out">
                <i className="bi-box-arrow-right fs-5"></i>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="d-flex flex-column flex-grow-1 min-vw-0" style={{ paddingRight: '1rem' }}>
        {/* Topbar */}
        <header
          className="glass-card m-3 ms-0 p-3 d-flex align-items-center justify-content-between"
          style={{ height: '70px', position: 'sticky', top: '1rem', zIndex: 900 }}
        >
          {/* Left search bar / title */}
          <div>
            <h4 className="mb-0 fw-semibold d-none d-md-block" style={{ fontSize: '1.25rem' }}>
              Welcome back, {user?.name}!
            </h4>
            <span className="text-secondary d-md-none fw-bold" style={{ fontSize: '1.2rem' }}>
              AI Mentor
            </span>
          </div>

          {/* Right Menu Buttons */}
          <div className="d-flex align-items-center gap-3">
            {/* Theme Toggle */}
            <button className="btn btn-glass p-2 border-0" onClick={toggleTheme} title="Toggle Theme">
              <i className={`bi ${isDark ? 'bi-sun text-warning' : 'bi-moon text-dark'} fs-5`}></i>
            </button>

            {/* Notifications */}
            <div className="position-relative">
              <button
                className="btn btn-glass p-2 border-0"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <i className="bi-bell fs-5"></i>
                {unreadCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: '0.65rem' }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  className="glass-card position-absolute end-0 mt-2 p-2"
                  style={{ width: '320px', maxHeight: '400px', overflowY: 'auto', zIndex: 1100 }}
                >
                  <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
                    <span className="fw-semibold">Notifications</span>
                    {unreadCount > 0 && <span className="badge bg-primary">{unreadCount} New</span>}
                  </div>
                  {notifications.length === 0 ? (
                    <p className="text-center text-muted my-3 py-3">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2 my-1 rounded border-start border-3 ${
                          n.isRead ? 'border-secondary opacity-70' : 'border-primary bg-primary bg-opacity-10'
                        }`}
                        style={{ fontSize: '0.85rem' }}
                      >
                        <div className="d-flex justify-content-between">
                          <strong className={n.isRead ? 'text-secondary' : ''}>{n.title}</strong>
                          {!n.isRead && (
                            <button
                              className="btn btn-sm text-primary p-0 border-0"
                              onClick={() => handleMarkAsRead(n.id)}
                            >
                              Mark Read
                            </button>
                          )}
                        </div>
                        <p className="mb-0 text-secondary mt-1">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="position-relative">
              <button
                className="btn btn-glass p-1 d-flex align-items-center gap-2 border-0"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <img
                  src={user?.profileImage || 'https://api.dicebear.com/7.x/adventurer/svg?seed=avatar'}
                  alt="Profile"
                  className="rounded-circle border border-primary"
                  width="32"
                  height="32"
                />
              </button>

              {showProfileMenu && (
                <div
                  className="glass-card position-absolute end-0 mt-2 py-2"
                  style={{ width: '180px', zIndex: 1100 }}
                >
                  <Link
                    to="/dashboard/profile"
                    className="dropdown-item px-3 py-2 text-decoration-none d-block text-secondary hover-bg"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <i className="bi-person me-2"></i> My Profile
                  </Link>
                  <hr className="dropdown-divider my-1 opacity-10" />
                  <button className="dropdown-item px-3 py-2 text-danger border-0 bg-transparent text-start w-100" onClick={handleLogout}>
                    <i className="bi-box-arrow-right me-2"></i> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-grow-1 px-3 pb-3" style={{ overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
