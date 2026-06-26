import React, { useState, useEffect, useRef } from 'react';
import { chatApi } from '../services/api';

const ChatPage = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchSessions = async () => {
    try {
      const data = await chatApi.getSessions();
      setSessions(data);
      if (data.length > 0) {
        handleSelectSession(data[0].id);
      } else {
        setLoadingSessions(false);
      }
    } catch (err) {
      console.error(err);
      setError('Could not load chat sessions.');
      setLoadingSessions(false);
    }
  };

  const handleSelectSession = async (id) => {
    setLoadingMessages(true);
    setError('');
    try {
      const data = await chatApi.getSessionDetails(id);
      setActiveSession(data);
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
      setError('Could not load session messages.');
    } finally {
      setLoadingMessages(false);
      setLoadingSessions(false);
    }
  };

  const handleCreateSession = async () => {
    const title = prompt('Enter chat session title:', 'Career Advisory');
    if (!title || !title.trim()) return;

    setLoadingSessions(true);
    try {
      const newSession = await chatApi.createSession(title.trim());
      setSessions((prev) => [newSession, ...prev]);
      handleSelectSession(newSession.id);
    } catch (err) {
      console.error(err);
      setError('Could not create new session.');
      setLoadingSessions(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeSession || sendingMessage) return;

    const text = inputText.trim();
    setInputText('');
    setSendingMessage(true);

    // Append user message immediately locally
    const userMsg = { sender: 'User', message: text, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const aiResponse = await chatApi.sendMessage(activeSession.id, text);
      // Append AI response
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error(err);
      setError('Failed to send message.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleDeleteSession = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      await chatApi.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeSession?.id === id) {
        setActiveSession(null);
        setMessages([]);
      }
    } catch (err) {
      console.error(err);
      setError('Could not delete session.');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoadingMessages(true);
    try {
      const results = await chatApi.searchHistory(searchQuery.trim());
      // Render search results as custom bubble view
      setActiveSession({ title: `Search: "${searchQuery}"` });
      setMessages(results.map(r => ({
        sender: r.sender,
        message: `[In Session: ${r.chatSessionId}] ${r.message}`,
        timestamp: r.timestamp
      })));
    } catch (err) {
      console.error(err);
      setError('Search query failed.');
    } finally {
      setLoadingMessages(false);
    }
  };

  return (
    <div className="container-fluid py-2 animate-fade-in" style={{ height: 'calc(100vh - 120px)' }}>
      <div className="row g-3 h-100">
        
        {/* Sidebar: Sessions & Search */}
        <div className="col-lg-4 col-xl-3 h-100">
          <div className="glass-card p-3 h-100 d-flex flex-column gap-3">
            
            {/* Create Session Button */}
            <button className="btn btn-gradient w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleCreateSession}>
              <i className="bi-plus-circle"></i> New Discussion
            </button>

            {/* History Search */}
            <form onSubmit={handleSearch} className="input-group">
              <input
                type="text"
                className="form-control bg-transparent"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-glass border-start-0 text-primary">
                <i className="bi-search"></i>
              </button>
            </form>

            {/* Sessions List */}
            <div className="flex-grow-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 310px)' }}>
              {loadingSessions ? (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                </div>
              ) : sessions.length === 0 ? (
                <p className="text-secondary text-center small py-3">No active chats.</p>
              ) : (
                <div className="d-flex flex-column gap-1">
                  {sessions.map((s) => (
                    <div
                      key={s.id}
                      className={`d-flex align-items-center justify-content-between p-2.5 rounded cursor-pointer transition-all ${
                        activeSession?.id === s.id ? 'bg-secondary bg-opacity-10 fw-semibold' : 'hover-bg'
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSelectSession(s.id)}
                    >
                      <div className="text-truncate text-secondary" style={{ maxWidth: '160px', fontSize: '0.85rem' }}>
                        <i className="bi-chat-left me-2 text-primary"></i> {s.title}
                      </div>
                      <button className="btn btn-sm text-danger p-0 border-0" onClick={(e) => handleDeleteSession(s.id, e)}>
                        <i className="bi-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="col-lg-8 col-xl-9 h-100">
          <div className="glass-card p-3 h-100 d-flex flex-column justify-content-between">
            {/* Header */}
            <div className="border-bottom pb-3 mb-3 d-flex align-items-center">
              <i className="bi-robot fs-3 text-primary me-2"></i>
              <div>
                <h5 className="mb-0 fw-bold display-font">
                  {activeSession ? activeSession.title : 'AI Mentor'}
                </h5>
                <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>Active session</span>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-grow-1 overflow-y-auto px-2" style={{ maxHeight: 'calc(100vh - 350px)' }}>
              {loadingMessages ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center py-5">
                  <i className="bi-chat-left-dots display-3 text-secondary mb-3"></i>
                  <h6 className="fw-semibold">Start Conversation</h6>
                  <p className="text-secondary small max-w-xs mx-auto">Ask the AI Career Mentor about mock interview advice, programming guidance, or resume formatting.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {messages.map((m, idx) => {
                    const isUser = m.sender === 'User';
                    return (
                      <div
                        key={idx}
                        className={`d-flex flex-column ${isUser ? 'align-items-end' : 'align-items-start'}`}
                      >
                        <div
                          className={`p-3 rounded-3 max-w-lg ${
                            isUser ? 'bg-primary text-white' : 'bg-secondary bg-opacity-10 text-secondary'
                          }`}
                          style={{ maxWidth: '75%', fontSize: '0.9rem', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}
                        >
                          {m.message}
                        </div>
                        <span className="text-muted mt-1" style={{ fontSize: '0.65rem' }}>
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {sendingMessage && (
                    <div className="d-flex flex-column align-items-start">
                      <div className="p-3 rounded-3 bg-secondary bg-opacity-10 text-secondary d-flex align-items-center gap-1">
                        <span className="spinner-grow spinner-grow-sm" role="status" style={{ animationDuration: '1s' }}></span>
                        <span className="spinner-grow spinner-grow-sm" role="status" style={{ animationDuration: '1.2s' }}></span>
                        <span className="spinner-grow spinner-grow-sm" role="status" style={{ animationDuration: '1.4s' }}></span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="mt-3 border-top pt-3 d-flex gap-2">
              <input
                type="text"
                className="form-control bg-transparent"
                placeholder="Ask about career advice, interview strategies..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={!activeSession || sendingMessage}
              />
              <button type="submit" className="btn btn-gradient px-4" disabled={!inputText.trim() || sendingMessage}>
                Send <i className="bi-send ms-1"></i>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatPage;
