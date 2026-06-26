import React, { useState, useEffect } from 'react';
import { resumeApi } from '../services/api';

const ResumePage = () => {
  const [file, setFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await resumeApi.getHistory();
      setHistory(data);
      if (data.length > 0) {
        // Load the details of the latest analysis by default
        fetchAnalysisDetails(data[0].id);
      } else {
        setHistoryLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Could not load analysis history.');
      setHistoryLoading(false);
    }
  };

  const fetchAnalysisDetails = async (id) => {
    setLoading(true);
    try {
      const data = await resumeApi.getDetails(id);
      setActiveAnalysis(data);
    } catch (err) {
      console.error(err);
      setError('Could not load analysis details.');
    } finally {
      setLoading(false);
      setHistoryLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      const ext = selected.name.split('.').pop().toLowerCase();
      if (ext !== 'pdf' && ext !== 'docx' && ext !== 'doc') {
        setError('Please upload only PDF or Word documents.');
        setFile(null);
      } else {
        setError('');
        setFile(selected);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    try {
      const result = await resumeApi.analyze(file);
      // Refresh history and load details
      const data = await resumeApi.getHistory();
      setHistory(data);
      await fetchAnalysisDetails(result.analysis.id);
      setFile(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred during resume upload.');
    } finally {
      setLoading(false);
    }
  };

  // Compute color based on ATS Score
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success border-success';
    if (score >= 60) return 'text-warning border-warning';
    return 'text-danger border-danger';
  };

  return (
    <div className="container-fluid py-2 animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold mb-1 display-font">AI Resume Analyzer</h2>
        <p className="text-secondary small">Upload your resume to evaluate ATS score, keyword alignment, and formatting checklist.</p>
      </div>

      <div className="row g-4">
        {/* Left Side: Upload & History */}
        <div className="col-lg-5">
          {/* Uploader Card */}
          <div className="glass-card p-4 mb-4">
            <h5 className="fw-bold mb-3"><i className="bi-cloud-arrow-up text-primary me-2"></i>Upload CV</h5>
            <form onSubmit={handleUpload}>
              <div
                className="border border-2 border-dashed rounded-3 p-4 text-center bg-secondary bg-opacity-5 hover-bg"
                style={{ cursor: 'pointer', borderStyle: 'dashed', borderColor: 'var(--border-color)' }}
                onClick={() => document.getElementById('resumeFileInput').click()}
              >
                <i className="bi-file-earmark-arrow-up display-5 text-secondary mb-2 d-block"></i>
                <span className="small d-block fw-semibold">{file ? file.name : 'Select PDF or DOCX file'}</span>
                <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>Max size 5MB</span>
                <input
                  id="resumeFileInput"
                  type="file"
                  className="d-none"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileChange}
                />
              </div>

              {error && (
                <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger mt-3 small" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-gradient w-100 mt-3"
                disabled={!file || loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Analyzing CV...
                  </>
                ) : (
                  'Analyze Resume'
                )}
              </button>
            </form>
          </div>

          {/* History List */}
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-3"><i className="bi-clock-history text-secondary me-2"></i>Analysis History</h5>
            {historyLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
              </div>
            ) : history.length === 0 ? (
              <p className="text-secondary text-center small my-3">No resumes uploaded yet.</p>
            ) : (
              <div className="list-group list-group-flush" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {history.map((h) => (
                  <button
                    key={h.id}
                    className={`list-group-item list-group-item-action bg-transparent border-0 d-flex justify-content-between align-items-center py-2.5 my-1 rounded text-secondary ${
                      activeAnalysis?.id === h.id ? 'bg-secondary bg-opacity-10 fw-semibold text-primary' : ''
                    }`}
                    onClick={() => fetchAnalysisDetails(h.id)}
                    style={{ fontSize: '0.85rem' }}
                  >
                    <div className="text-truncate" style={{ maxWidth: '180px' }}>
                      <i className="bi-file-earmark-text me-2"></i> {h.fileName}
                    </div>
                    <span className={`badge rounded-pill bg-primary bg-opacity-10 text-primary`}>
                      Score: {h.resumeScore}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Score & Feedback details */}
        <div className="col-lg-7">
          <div className="glass-card p-4 h-100 d-flex flex-column justify-content-center">
            {loading ? (
              <div className="text-center py-5 my-5">
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <p className="text-secondary small">Evaluating ATS structural and keyword rules...</p>
              </div>
            ) : !activeAnalysis ? (
              <div className="text-center py-5 my-5">
                <i className="bi-file-earmark-person display-3 text-secondary mb-3"></i>
                <h5 className="fw-semibold">No Resume Selected</h5>
                <p className="text-secondary small max-w-xs mx-auto">Upload a resume or select one from the history panel to view detailed AI optimization feedback.</p>
              </div>
            ) : (
              <div>
                {/* Score Header */}
                <div className="d-flex align-items-center justify-content-between border-bottom pb-4 mb-4">
                  <div>
                    <h4 className="fw-bold mb-1 display-font text-truncate" style={{ maxWidth: '240px' }}>{activeAnalysis.fileName}</h4>
                    <span className="text-secondary small">Analyzed on {new Date(activeAnalysis.createdDate).toLocaleDateString()}</span>
                  </div>

                  {/* Circular Score display */}
                  <div
                    className={`border border-4 rounded-circle d-flex flex-column align-items-center justify-content-center ${getScoreColor(activeAnalysis.resumeScore)}`}
                    style={{ width: '80px', height: '80px', fontSize: '1.25rem', fontWeight: 'bold' }}
                  >
                    <span>{activeAnalysis.resumeScore}</span>
                    <span className="text-secondary" style={{ fontSize: '0.65rem', marginTop: '-4px' }}>ATS</span>
                  </div>
                </div>

                {/* Feedback suggestions */}
                <h5 className="fw-bold mb-3"><i className="bi-lightbulb text-warning me-2"></i>AI Suggestions</h5>
                {activeAnalysis.feedbacks?.length === 0 ? (
                  <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 small">
                    <i className="bi-check-circle-fill me-2"></i> Perfect score! No critical suggestions found.
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {activeAnalysis.feedbacks?.map((f, idx) => (
                      <div key={idx} className="p-3 rounded bg-secondary bg-opacity-5 border-start border-3 border-primary">
                        <span className="badge bg-primary bg-opacity-10 text-primary mb-2" style={{ fontSize: '0.65rem' }}>{f.category}</span>
                        <p className="mb-0 text-secondary" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{f.suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
