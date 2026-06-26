import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi, roadmapApi } from '../services/api';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (id) => {
    try {
      await roadmapApi.toggleTask(id);
      // Refresh statistics (which recalculates progress)
      fetchDashboardStats();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger m-3" role="alert">
        <i className="bi-exclamation-octagon-fill me-2"></i> {error}
      </div>
    );
  }

  return (
    <div className="container-fluid py-2 animate-fade-in">
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1 display-font">Mentor Dashboard</h2>
        <p className="text-secondary small">Track your learning progress, resume scores, and mock interview reviews.</p>
      </div>

      {/* Metrics Row */}
      <div className="row g-4 mb-4">
        {/* Resume Score Card */}
        <div className="col-sm-6 col-xl-3">
          <div className="glass-card p-4 h-100 d-flex align-items-center gap-3">
            <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle" style={{ width: '60px', height: '60px' }}>
              <i className="bi-file-earmark-person fs-3"></i>
            </div>
            <div>
              <span className="text-secondary small d-block">Resume ATS Score</span>
              <h3 className="mb-0 fw-bold">{stats?.resumeScore || 0}<span className="fs-6 text-muted">/100</span></h3>
              <Link to="/dashboard/resume" className="small text-primary text-decoration-none">
                Re-analyze <i className="bi-chevron-right"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Mock Interview Card */}
        <div className="col-sm-6 col-xl-3">
          <div className="glass-card p-4 h-100 d-flex align-items-center gap-3">
            <div className="d-flex align-items-center justify-content-center bg-purple bg-opacity-10 text-purple rounded-circle" style={{ width: '60px', height: '60px' }}>
              <i className="bi-people fs-3"></i>
            </div>
            <div>
              <span className="text-secondary small d-block">Interview Average</span>
              <h3 className="mb-0 fw-bold">{stats?.interviewScore || 0}<span className="fs-6 text-muted">%</span></h3>
              <Link to="/dashboard/interview" className="small text-purple text-decoration-none">
                Start Prep <i className="bi-chevron-right"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Roadmap Progress Card */}
        <div className="col-sm-6 col-xl-3">
          <div className="glass-card p-4 h-100 d-flex align-items-center gap-3">
            <div className="d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle" style={{ width: '60px', height: '60px' }}>
              <i className="bi-compass fs-3"></i>
            </div>
            <div className="flex-grow-1">
              <span className="text-secondary small d-block">Roadmap Progress</span>
              <h3 className="mb-1 fw-bold">{stats?.learningProgress || 0}<span className="fs-6 text-muted">%</span></h3>
              <div className="progress" style={{ height: '6px' }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${stats?.learningProgress || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Streak Card */}
        <div className="col-sm-6 col-xl-3">
          <div className="glass-card p-4 h-100 d-flex align-items-center gap-3">
            <div className="d-flex align-items-center justify-content-center bg-warning bg-opacity-10 text-warning rounded-circle" style={{ width: '60px', height: '60px' }}>
              <i className="bi-fire fs-3"></i>
            </div>
            <div>
              <span className="text-secondary small d-block">Learning Streak</span>
              <h3 className="mb-0 fw-bold">{stats?.dailyStreak || 0} <span className="fs-6 text-muted">Days</span></h3>
              <span className="text-secondary small">Keep it up! 🔥</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Tasks & Charts */}
        <div className="col-lg-8">
          {/* Upcoming Roadmap Checklist */}
          <div className="glass-card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0 fw-bold"><i className="bi-check2-square text-primary me-2"></i>Upcoming Roadmap Tasks</h5>
              <Link to="/dashboard/roadmap" className="btn btn-sm btn-glass text-primary px-3 py-1">
                View Roadmap
              </Link>
            </div>

            {stats?.upcomingTasks?.length === 0 ? (
              <div className="text-center py-4">
                <i className="bi-clipboard-check fs-2 text-muted mb-2"></i>
                <p className="text-secondary mb-0">No active roadmap tasks. Go generate one!</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {stats?.upcomingTasks?.map((task) => (
                  <div key={task.id} className="d-flex align-items-center p-3 rounded bg-secondary bg-opacity-5 hover-bg transition-all">
                    <input
                      type="checkbox"
                      className="form-check-input me-3"
                      style={{ cursor: 'pointer', width: '1.2rem', height: '1.2rem' }}
                      checked={false}
                      onChange={() => handleToggleTask(task.id)}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-0 fw-semibold text-wrap">{task.task}</h6>
                      <span className="text-secondary small mt-1 d-inline-block">
                        <span className="badge bg-primary bg-opacity-10 text-primary me-2">{task.period}</span>
                        Target: {new Date(task.targetDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Performance Overview (Simulated CSS chart) */}
          <div className="glass-card p-4">
            <h5 className="mb-4 fw-bold"><i className="bi-graph-up-arrow text-purple me-2"></i>Interview Performance History</h5>
            {stats?.chartData?.length === 0 ? (
              <p className="text-muted text-center py-5">Complete mock interviews to view progress charts.</p>
            ) : (
              <div>
                <div className="d-flex align-items-end justify-content-between pt-3" style={{ height: '220px' }}>
                  {stats?.chartData?.map((data, idx) => (
                    <div key={idx} className="d-flex flex-column align-items-center flex-grow-1">
                      <div className="position-relative w-100 d-flex flex-column align-items-center">
                        <span className="small fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>{data.score}%</span>
                        <div
                          className="rounded-top"
                          style={{
                            width: '24px',
                            height: `${data.score * 1.6}px`,
                            background: 'var(--accent-gradient)',
                            transition: 'height 0.8s ease-out'
                          }}
                        ></div>
                      </div>
                      <span className="text-secondary text-truncate mt-2 text-center w-100" style={{ fontSize: '0.75rem', maxWidth: '80px' }}>
                        {data.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="col-lg-4">
          <div className="glass-card p-4 h-100">
            <h5 className="mb-4 fw-bold"><i className="bi-activity text-danger me-2"></i>Recent Activity</h5>
            {stats?.recentActivities?.length === 0 ? (
              <p className="text-muted text-center py-5">No recent activities logged.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {stats?.recentActivities?.map((activity, idx) => {
                  let badgeClass = 'bg-primary';
                  if (activity.type === 'Interview') badgeClass = 'bg-purple';
                  if (activity.type === 'Resume') badgeClass = 'bg-info';
                  
                  return (
                    <div key={idx} className="p-3 rounded border-start border-3 border-secondary bg-secondary bg-opacity-5">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className={`badge ${badgeClass} bg-opacity-10 text-truncate`} style={{ color: 'var(--accent-primary)', fontSize: '0.7rem' }}>
                          {activity.type}
                        </span>
                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                          {new Date(activity.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h6 className="fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>{activity.title}</h6>
                      <p className="mb-0 text-secondary" style={{ fontSize: '0.75rem' }}>Status: {activity.status}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
