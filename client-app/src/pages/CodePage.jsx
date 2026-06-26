import React, { useState, useEffect } from 'react';
import { codeApi } from '../services/api';

const CodePage = () => {
  const [problems, setProblems] = useState([]);
  const [activeProblem, setActiveProblem] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  
  const [codeText, setCodeText] = useState('');
  const [selectedLang, setSelectedLang] = useState('JavaScript');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [runOutput, setRunOutput] = useState('');
  const [activeTab, setActiveTab] = useState('description'); // 'description', 'submissions'
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProblems();
    fetchSubmissions();
  }, []);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const data = await codeApi.getProblems();
      setProblems(data);
    } catch (err) {
      console.error(err);
      setError('Could not load coding challenges.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const data = await codeApi.getSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to load submissions', err);
    }
  };

  const handleSelectProblem = async (id) => {
    setLoading(true);
    setRunOutput('');
    setActiveTab('description');
    try {
      const data = await codeApi.getProblemDetails(id);
      setActiveProblem(data);
      
      // Provide default boilerplate templates
      if (selectedLang === 'JavaScript') {
        setCodeText(`function solve(input) {\n  // Write your code here\n  \n  return null;\n}`);
      } else {
        setCodeText(`def solve(input):\n    # Write your code here\n    pass`);
      }
    } catch (err) {
      console.error(err);
      setError('Problem detail loading failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = async () => {
    if (!codeText.trim() || submitting) return;
    setSubmitting(true);
    setRunOutput('Running test cases in simulator...');
    try {
      const result = await codeApi.runCode(activeProblem.id, selectedLang, codeText);
      setRunOutput(result.output || result.status);
    } catch (err) {
      setRunOutput('Execution failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!codeText.trim() || submitting) return;
    setSubmitting(true);
    setRunOutput('Submitting to grader...');
    try {
      const result = await codeApi.submitCode(activeProblem.id, selectedLang, codeText);
      setRunOutput(`Result: ${result.submission.Result}\nSubmitted on: ${new Date(result.submission.SubmittedDate).toLocaleTimeString()}`);
      fetchSubmissions(); // refresh history logs
      setActiveTab('submissions');
    } catch (err) {
      setRunOutput('Submission failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'All' || p.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="container-fluid py-2 animate-fade-in">
      {/* Header */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold mb-1 display-font">DSA Practice Terminal</h2>
          <p className="text-secondary small">Hone your problem-solving skills with compiler simulations and automated test validations.</p>
        </div>
        {activeProblem && (
          <button className="btn btn-glass btn-sm" onClick={() => setActiveProblem(null)}>
            <i className="bi-arrow-left me-1"></i> Back to list
          </button>
        )}
      </div>

      {/* Main Container */}
      {!activeProblem ? (
        /* Problem List View */
        <div className="row g-4">
          <div className="col-10 mx-auto">
            <div className="glass-card p-4">
              
              {/* Search & filters */}
              <div className="row g-3 mb-4">
                <div className="col-md-7">
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0 text-secondary"><i className="bi-search"></i></span>
                    <input
                      type="text"
                      className="form-control bg-transparent border-start-0"
                      placeholder="Search coding challenges..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-5 d-flex gap-2">
                  <button
                    className={`btn btn-sm flex-grow-1 ${filterDifficulty === 'All' ? 'btn-gradient' : 'btn-glass'}`}
                    onClick={() => setFilterDifficulty('All')}
                  >
                    All
                  </button>
                  <button
                    className={`btn btn-sm flex-grow-1 ${filterDifficulty === 'Easy' ? 'btn-gradient' : 'btn-glass'}`}
                    onClick={() => setFilterDifficulty('Easy')}
                  >
                    Easy
                  </button>
                  <button
                    className={`btn btn-sm flex-grow-1 ${filterDifficulty === 'Medium' ? 'btn-gradient' : 'btn-glass'}`}
                    onClick={() => setFilterDifficulty('Medium')}
                  >
                    Medium
                  </button>
                </div>
              </div>

              {/* Table list */}
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : filteredProblems.length === 0 ? (
                <p className="text-center text-secondary py-4 mb-0">No challenges found matching queries.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr className="text-secondary small">
                        <th>Challenge Title</th>
                        <th>Difficulty</th>
                        <th className="text-end">Solve</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProblems.map((p) => {
                        let diffClass = 'bg-success';
                        if (p.difficulty === 'Medium') diffClass = 'bg-warning';
                        if (p.difficulty === 'Hard') diffClass = 'bg-danger';

                        return (
                          <tr key={p.id}>
                            <td>
                              <strong className="text-secondary">{p.title}</strong>
                            </td>
                            <td>
                              <span className={`badge ${diffClass} bg-opacity-10`} style={{ color: diffClass === 'bg-success' ? '#198754' : (diffClass === 'bg-warning' ? '#ffc107' : '#dc3545') }}>
                                {p.difficulty}
                              </span>
                            </td>
                            <td className="text-end">
                              <button className="btn btn-sm btn-gradient" onClick={() => handleSelectProblem(p.id)}>
                                Code Task
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </div>
        </div>
      ) : (
        /* Workspace Editor Split-screen View */
        <div className="row g-3" style={{ minHeight: 'calc(100vh - 220px)' }}>
          {/* Left Panel: Description vs Submissions */}
          <div className="col-lg-5">
            <div className="glass-card p-4 h-100 d-flex flex-column">
              <ul className="nav nav-tabs border-bottom mb-3">
                <li className="nav-item">
                  <button
                    className={`nav-link bg-transparent border-0 text-secondary ${activeTab === 'description' ? 'active fw-bold border-bottom border-primary text-primary' : ''}`}
                    onClick={() => setActiveTab('description')}
                  >
                    Problem Description
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link bg-transparent border-0 text-secondary ${activeTab === 'submissions' ? 'active fw-bold border-bottom border-primary text-primary' : ''}`}
                    onClick={() => setActiveTab('submissions')}
                  >
                    My Submissions
                  </button>
                </li>
              </ul>

              <div className="flex-grow-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 350px)' }}>
                {activeTab === 'description' ? (
                  <div>
                    <h4 className="fw-bold display-font mb-2">{activeProblem.title}</h4>
                    <span className="badge bg-primary bg-opacity-10 text-primary mb-4">{activeProblem.difficulty}</span>
                    
                    <div className="text-secondary small mb-4" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                      {activeProblem.description}
                    </div>

                    <div className="p-3 bg-secondary bg-opacity-5 rounded mb-3">
                      <strong className="small">Example Input:</strong>
                      <pre className="mb-0 mt-1 small bg-dark text-white p-2 rounded">{activeProblem.exampleInput}</pre>
                    </div>

                    <div className="p-3 bg-secondary bg-opacity-5 rounded">
                      <strong className="small">Example Output:</strong>
                      <pre className="mb-0 mt-1 small bg-dark text-white p-2 rounded">{activeProblem.exampleOutput}</pre>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h5 className="fw-bold mb-3">Submission logs</h5>
                    {submissions.filter(s => s.codingProblemId === activeProblem.id).length === 0 ? (
                      <p className="text-secondary small text-center my-4">No submissions yet for this problem.</p>
                    ) : (
                      <div className="d-flex flex-column gap-2">
                        {submissions
                          .filter(s => s.codingProblemId === activeProblem.id)
                          .map((s) => (
                            <div key={s.id} className="p-3 rounded bg-secondary bg-opacity-5 d-flex justify-content-between align-items-center">
                              <div>
                                <span className={`badge ${s.result === 'Accepted' ? 'bg-success' : 'bg-danger'} bg-opacity-10 me-2`} style={{ color: s.result === 'Accepted' ? '#198754' : '#dc3545' }}>
                                  {s.result}
                                </span>
                                <span className="small text-secondary">{s.language}</span>
                              </div>
                              <span className="text-muted small">{new Date(s.submittedDate).toLocaleDateString()}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Code input & output console */}
          <div className="col-lg-7">
            <div className="glass-card p-3 h-100 d-flex flex-column justify-content-between">
              
              {/* Language selection header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="small fw-semibold text-secondary">Editor Console</span>
                <select
                  className="form-select form-select-sm bg-transparent"
                  style={{ width: '130px' }}
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                >
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                </select>
              </div>

              {/* Textarea code terminal */}
              <div className="flex-grow-1 mb-3">
                <textarea
                  className="form-control bg-dark text-white font-monospace p-3"
                  style={{
                    fontFamily: 'Consolas, Monaco, Lucida Console, monospace',
                    height: '280px',
                    fontSize: '0.9rem',
                    resize: 'none',
                    lineHeight: '1.4'
                  }}
                  value={codeText}
                  onChange={(e) => setCodeText(e.target.value)}
                  disabled={submitting}
                ></textarea>
              </div>

              {/* Output Console Console */}
              <div className="p-3 bg-secondary bg-opacity-10 rounded border mb-3" style={{ minHeight: '110px' }}>
                <span className="small text-secondary fw-bold d-block mb-1 border-bottom pb-1">Console Output</span>
                <pre className="mb-0 text-secondary" style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap', maxHeight: '80px', overflowY: 'auto' }}>
                  {runOutput || 'No output details loaded.'}
                </pre>
              </div>

              {/* Execution Actions bar */}
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-glass px-4" onClick={handleRunCode} disabled={submitting}>
                  Run Tests
                </button>
                <button className="btn btn-gradient px-4" onClick={handleSubmitCode} disabled={submitting}>
                  Submit Code
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodePage;
