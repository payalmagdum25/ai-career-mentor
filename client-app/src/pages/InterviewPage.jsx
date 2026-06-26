import React, { useState, useEffect } from 'react';
import { interviewApi } from '../services/api';

const InterviewPage = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerInput, setAnswerInput] = useState('');
  
  const [techSelect, setTechSelect] = useState('React');
  const [viewState, setViewState] = useState('setup'); // 'setup', 'interview', 'review', 'completed'
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = await interviewApi.getSessions();
      setSessions(data);
    } catch (err) {
      console.error(err);
      setError('Could not load interview logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartInterview = async () => {
    setLoading(true);
    setError('');
    try {
      const session = await interviewApi.startSession(techSelect);
      setActiveSession(session);
      setCurrentQuestionIndex(0);
      setAnswerInput('');
      setViewState('interview');
    } catch (err) {
      console.error(err);
      setError('Failed to start mock interview.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerInput.trim() || submitting) return;

    setSubmitting(true);
    setError('');
    try {
      const question = activeSession.questions[currentQuestionIndex];
      const resultQuestion = await interviewApi.submitAnswer(question.id, answerInput.trim());
      
      // Update local state details
      const updatedQuestions = [...activeSession.questions];
      updatedQuestions[currentQuestionIndex] = resultQuestion;
      
      setActiveSession({ ...activeSession, questions: updatedQuestions });
      setViewState('review');
    } catch (err) {
      console.error(err);
      setError('Failed to submit answer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    setError('');
    if (currentQuestionIndex + 1 < activeSession.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswerInput('');
      setViewState('interview');
    } else {
      // Complete interview
      setLoading(true);
      try {
        const result = await interviewApi.completeSession(activeSession.id);
        setActiveSession(prev => ({ ...prev, score: result.overallScore }));
        setViewState('completed');
        fetchSessions(); // refresh history list
      } catch (err) {
        console.error(err);
        setError('Failed to complete session.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewPastSession = async (id) => {
    setLoading(true);
    setError('');
    try {
      const session = await interviewApi.getSessionDetails(id);
      setActiveSession(session);
      setViewState('completed');
    } catch (err) {
      console.error(err);
      setError('Could not load session details.');
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = activeSession?.questions?.[currentQuestionIndex];

  return (
    <div className="container-fluid py-2 animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold mb-1 display-font">Mock Interview Arena</h2>
        <p className="text-secondary small">Simulate high-fidelity technical interviews and get instant evaluations with granular scoring.</p>
      </div>

      <div className="row g-4">
        {/* Left Side: Setup & History */}
        <div className="col-lg-4">
          
          {/* Configure Panel */}
          {viewState === 'setup' && (
            <div className="glass-card p-4 mb-4">
              <h5 className="fw-bold mb-3"><i className="bi-play-circle text-primary me-2"></i>Start Interview</h5>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Select Technology Stack</label>
                <select
                  className="form-select bg-transparent"
                  value={techSelect}
                  onChange={(e) => setTechSelect(e.target.value)}
                >
                  <option value="React">React (Frontend)</option>
                  <option value="C# & ASP.NET Core">C# & ASP.NET Core (Backend)</option>
                  <option value="SQL & Databases">SQL & Databases (Data)</option>
                  <option value="General Software Engineering">General Software Engineering</option>
                </select>
              </div>

              {error && (
                <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger mb-3 small">
                  {error}
                </div>
              )}

              <button className="btn btn-gradient w-100 py-2" onClick={handleStartInterview} disabled={loading}>
                {loading ? 'Initializing...' : 'Begin Simulation'}
              </button>
            </div>
          )}

          {/* Setup / Quit button for active session */}
          {viewState !== 'setup' && (
            <div className="glass-card p-4 mb-4 text-center">
              <span className="badge bg-purple bg-opacity-10 text-purple mb-3">ACTIVE SIMULATION</span>
              <h5>{activeSession?.technology} Interview</h5>
              <p className="text-secondary small">Completing 5 core questions</p>
              <button
                className="btn btn-sm btn-glass text-danger w-100"
                onClick={() => {
                  if (confirm('Quit active session? Progress will be lost.')) {
                    setViewState('setup');
                    setActiveSession(null);
                  }
                }}
              >
                Quit Session
              </button>
            </div>
          )}

          {/* Past Sessions History */}
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-3"><i className="bi-journal-check text-secondary me-2"></i>Performance History</h5>
            {loading && viewState === 'setup' ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-primary"></div>
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-secondary text-center small my-3">No mock interviews completed.</p>
            ) : (
              <div className="list-group list-group-flush" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    className={`list-group-item list-group-item-action bg-transparent border-0 d-flex justify-content-between align-items-center py-2.5 my-1 rounded text-secondary ${
                      activeSession?.id === s.id ? 'bg-secondary bg-opacity-10 fw-semibold text-primary' : ''
                    }`}
                    onClick={() => handleViewPastSession(s.id)}
                    style={{ fontSize: '0.85rem' }}
                  >
                    <div className="text-truncate" style={{ maxWidth: '160px' }}>
                      <i className="bi-code me-2 text-primary"></i> {s.technology}
                    </div>
                    <span className="badge bg-purple bg-opacity-10 text-purple">
                      {s.score}%
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Active Workspace */}
        <div className="col-lg-8">
          <div className="glass-card p-4 h-100 d-flex flex-column justify-content-center">
            
            {/* Setup State message */}
            {viewState === 'setup' && (
              <div className="text-center py-5 my-4">
                <i className="bi-people display-3 text-secondary mb-3"></i>
                <h4 className="fw-semibold">Interview Simulator Room</h4>
                <p className="text-secondary small max-w-sm mx-auto">
                  Configure your technology target and start. The AI will ask you technical conceptual queries, analyze your text details, and score your logical layout.
                </p>
              </div>
            )}

            {/* Interview Question Terminal */}
            {viewState === 'interview' && currentQuestion && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="small text-secondary fw-semibold">Question {currentQuestionIndex + 1} of 5</span>
                  <div className="progress w-50" style={{ height: '6px' }}>
                    <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${(currentQuestionIndex + 1) * 20}%` }}></div>
                  </div>
                </div>

                <div className="p-3 bg-secondary bg-opacity-5 rounded mb-4">
                  <h5 className="fw-bold mb-0" style={{ lineHeight: '1.4' }}>{currentQuestion.questionText}</h5>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold">Your Explanation</label>
                  <textarea
                    className="form-control bg-transparent"
                    rows="6"
                    placeholder="Type your detailed explanation here..."
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    disabled={submitting}
                  ></textarea>
                </div>

                {error && (
                  <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger mb-3 small">
                    {error}
                  </div>
                )}

                <button
                  className="btn btn-gradient w-100 py-2.5"
                  onClick={handleSubmitAnswer}
                  disabled={!answerInput.trim() || submitting}
                >
                  {submitting ? 'Evaluating answer details...' : 'Submit Explanation'}
                </button>
              </div>
            )}

            {/* Answer feedback view */}
            {viewState === 'review' && currentQuestion && (
              <div>
                <h5 className="fw-bold mb-3 text-success"><i className="bi-check-circle me-2"></i>Answer Submitted</h5>
                
                <div className="p-3 bg-secondary bg-opacity-5 rounded mb-3">
                  <strong>Question:</strong>
                  <p className="mb-0 mt-1">{currentQuestion.questionText}</p>
                </div>

                <div className="p-3 bg-secondary bg-opacity-5 rounded mb-4">
                  <strong>Your Answer:</strong>
                  <p className="mb-0 mt-1 text-secondary" style={{ fontSize: '0.9rem' }}>{currentQuestion.userAnswer}</p>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-sm-3 text-center">
                    <div className="border rounded p-3 bg-primary bg-opacity-5 h-100 d-flex flex-column align-items-center justify-content-center">
                      <span className="display-6 fw-bold text-primary">{currentQuestion.score}</span>
                      <span className="small text-secondary">Score</span>
                    </div>
                  </div>
                  <div className="col-sm-9">
                    <div className="border rounded p-3 h-100">
                      <strong>AI evaluation:</strong>
                      <p className="mb-0 mt-1 text-secondary" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{currentQuestion.feedback}</p>
                    </div>
                  </div>
                </div>

                <button className="btn btn-gradient w-100 py-2" onClick={handleNext}>
                  {currentQuestionIndex + 1 < activeSession.questions.length ? 'Next Question' : 'Finish & Calculate Total'}
                </button>
              </div>
            )}

            {/* Final Completed Summary Screen */}
            {viewState === 'completed' && activeSession && (
              <div>
                {/* Score Dial Header */}
                <div className="text-center py-4 border-bottom mb-4">
                  <div className="d-inline-flex border border-4 border-purple rounded-circle align-items-center justify-content-center mb-3" style={{ width: '100px', height: '100px' }}>
                    <span className="display-5 fw-bold text-purple">{activeSession.score}%</span>
                  </div>
                  <h4 className="fw-bold">Interview Completed!</h4>
                  <p className="text-secondary small">Reviewed technology stack: {activeSession.technology}</p>
                  <button className="btn btn-gradient px-4" onClick={() => setViewState('setup')}>
                    Start New Simulation
                  </button>
                </div>

                {/* Granular Questions Log */}
                <h5 className="fw-bold mb-3">AI Session Breakdown</h5>
                <div className="d-flex flex-column gap-3" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  {activeSession.questions?.map((q, idx) => (
                    <div key={idx} className="p-3 rounded border bg-secondary bg-opacity-5">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong className="small">Question {idx + 1}</strong>
                        <span className="badge bg-primary bg-opacity-10 text-primary">Score: {q.score}</span>
                      </div>
                      <p className="mb-2 fw-semibold" style={{ fontSize: '0.9rem' }}>{q.questionText}</p>
                      <p className="mb-2 text-secondary small" style={{ fontStyle: 'italic' }}>Your answer: "{q.userAnswer}"</p>
                      <p className="mb-0 text-secondary small" style={{ fontSize: '0.8rem' }}><strong className="text-success">Feedback:</strong> {q.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default InterviewPage;
