import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const tempErrors = {};
    if (!email) tempErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = 'Invalid email address';
    if (!password) tempErrors.password = 'Password is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center py-5 my-4">
      <div className="glass-card p-5 w-100 animate-fade-in" style={{ maxWidth: '480px' }}>
        <div className="text-center mb-4">
          <i className="bi-cpu text-primary fs-1 mb-2"></i>
          <h2 className="fw-bold display-font">Welcome Back</h2>
          <p className="text-secondary small">Access your career mentor dashboard</p>
        </div>

        {error && (
          <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger rounded-3" role="alert">
            <i className="bi-exclamation-triangle-fill me-2"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="mb-3">
            <label className="form-label fw-semibold small">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 text-secondary">
                <i className="bi-envelope"></i>
              </span>
              <input
                type="email"
                className={`form-control bg-transparent border-start-0 ${errors.email ? 'is-invalid' : ''}`}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: '' }));
                }}
                disabled={loading}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
          </div>

          {/* Password input */}
          <div className="mb-4">
            <div className="d-flex justify-content-between">
              <label className="form-label fw-semibold small">Password</label>
            </div>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 text-secondary">
                <i className="bi-lock"></i>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-control bg-transparent border-start-0 border-end-0 ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: '' }));
                }}
                disabled={loading}
              />
              <button
                type="button"
                className="input-group-text bg-transparent border-start-0 text-secondary"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
          </div>

          {/* Action Button */}
          <button type="submit" className="btn btn-gradient w-100 py-2.5 mb-3" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="text-center mt-3 small">
          <span className="text-secondary">Don't have an account? </span>
          <Link to="/register" className="text-primary text-decoration-none fw-semibold">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
