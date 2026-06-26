import React, { useState, useEffect } from 'react';
import { roadmapApi } from '../services/api';

const RoadmapPage = () => {
  const [roadmap, setRoadmap] = useState([]);
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [targetSkills, setTargetSkills] = useState('React, C#, SQL Server');
  
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      const data = await roadmapApi.getRoadmap();
      setRoadmap(data);
    } catch (err) {
      console.error(err);
      setError('Could not fetch your roadmap details.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!targetRole.trim() || !targetSkills.trim() || generating) return;

    setGenerating(true);
    setError('');
    
    // Parse comma-separated skills
    const skillsList = targetSkills.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const data = await roadmapApi.generate(targetRole.trim(), skillsList);
      setRoadmap(data);
    } catch (err) {
      console.error(err);
      setError('Failed to generate career learning roadmap.');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const updatedTask = await roadmapApi.toggleTask(id);
      setRoadmap((prev) => prev.map((t) => (t.id === id ? { ...t, completed: updatedTask.completed } : t)));
    } catch (err) {
      console.error(err);
    }
  };

  // Group tasks by period
  const dailyTasks = roadmap.filter((t) => t.period === 'Daily');
  const weeklyTasks = roadmap.filter((t) => t.period === 'Weekly');
  const monthlyTasks = roadmap.filter((t) => t.period === 'Monthly');

  // Compute progress percentage
  const totalCount = roadmap.length;
  const completedCount = roadmap.filter((t) => t.completed).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="container-fluid py-2 animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold mb-1 display-font">Learning Roadmap</h2>
        <p className="text-secondary small">Define your target career path and skills to construct a day-by-day learning checklist.</p>
      </div>

      <div className="row g-4">
        {/* Setup Parameters Panel */}
        <div className="col-lg-4">
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-3"><i className="bi-sliders2 text-primary me-2"></i>Configure Path</h5>
            <form onSubmit={handleGenerate}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Target Career Role</label>
                <input
                  type="text"
                  className="form-control bg-transparent"
                  placeholder="e.g. Backend Engineer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  disabled={generating}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Target Skills (comma-separated)</label>
                <input
                  type="text"
                  className="form-control bg-transparent"
                  placeholder="e.g. React, Node.js, Git"
                  value={targetSkills}
                  onChange={(e) => setTargetSkills(e.target.value)}
                  disabled={generating}
                />
              </div>

              {error && (
                <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger mb-3 small">
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-gradient w-100 py-2" disabled={generating}>
                {generating ? 'Re-calculating...' : 'Build Roadmap'}
              </button>
            </form>
          </div>
        </div>

        {/* Learning Tasks Checklists */}
        <div className="col-lg-8">
          <div className="glass-card p-4 h-100">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : roadmap.length === 0 ? (
              <div className="text-center py-5 my-4">
                <i className="bi-compass display-3 text-secondary mb-3"></i>
                <h5 className="fw-semibold">No Roadmap Active</h5>
                <p className="text-secondary small max-w-sm mx-auto">Fill in your dream tech stack on the parameters panel and let AI plot your daily, weekly, and monthly training tasks.</p>
              </div>
            ) : (
              <div>
                {/* Global Progress Bar */}
                <div className="border-bottom pb-4 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold mb-0">Roadmap Progress</h5>
                    <span className="badge bg-success bg-opacity-10 text-success">{progressPercent}% Completed</span>
                  </div>
                  <div className="progress" style={{ height: '10px', borderRadius: '5px' }}>
                    <div
                      className="progress-bar bg-success progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Task Checklist grids */}
                <div className="d-flex flex-column gap-4">
                  
                  {/* Daily Section */}
                  {dailyTasks.length > 0 && (
                    <div>
                      <h6 className="fw-bold text-primary mb-3"><i className="bi-sun me-2"></i>Daily Action Checklist</h6>
                      <div className="d-flex flex-column gap-2">
                        {dailyTasks.map((t) => (
                          <div key={t.id} className="d-flex align-items-center p-3 rounded bg-secondary bg-opacity-5 hover-bg">
                            <input
                              type="checkbox"
                              className="form-check-input me-3"
                              style={{ cursor: 'pointer', width: '1.2rem', height: '1.2rem' }}
                              checked={t.completed}
                              onChange={() => handleToggleTask(t.id)}
                            />
                            <span className={`text-wrap text-secondary ${t.completed ? 'text-decoration-line-through opacity-60' : 'fw-semibold'}`} style={{ fontSize: '0.9rem' }}>
                              {t.task}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Weekly Section */}
                  {weeklyTasks.length > 0 && (
                    <div>
                      <h6 className="fw-bold text-purple mb-3"><i className="bi-calendar-week me-2"></i>Weekly Goal Focus</h6>
                      <div className="d-flex flex-column gap-2">
                        {weeklyTasks.map((t) => (
                          <div key={t.id} className="d-flex align-items-center p-3 rounded bg-secondary bg-opacity-5 hover-bg">
                            <input
                              type="checkbox"
                              className="form-check-input me-3"
                              style={{ cursor: 'pointer', width: '1.2rem', height: '1.2rem' }}
                              checked={t.completed}
                              onChange={() => handleToggleTask(t.id)}
                            />
                            <span className={`text-wrap text-secondary ${t.completed ? 'text-decoration-line-through opacity-60' : 'fw-semibold'}`} style={{ fontSize: '0.9rem' }}>
                              {t.task}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Monthly Section */}
                  {monthlyTasks.length > 0 && (
                    <div>
                      <h6 className="fw-bold text-warning mb-3"><i className="bi-calendar-month me-2"></i>Monthly Milestones</h6>
                      <div className="d-flex flex-column gap-2">
                        {monthlyTasks.map((t) => (
                          <div key={t.id} className="d-flex align-items-center p-3 rounded bg-secondary bg-opacity-5 hover-bg">
                            <input
                              type="checkbox"
                              className="form-check-input me-3"
                              style={{ cursor: 'pointer', width: '1.2rem', height: '1.2rem' }}
                              checked={t.completed}
                              onChange={() => handleToggleTask(t.id)}
                            />
                            <span className={`text-wrap text-secondary ${t.completed ? 'text-decoration-line-through opacity-60' : 'fw-semibold'}`} style={{ fontSize: '0.9rem' }}>
                              {t.task}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RoadmapPage;
