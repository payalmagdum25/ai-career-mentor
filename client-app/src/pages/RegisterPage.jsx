import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Student'); // Student, Mentor, Admin
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const tempErrors = {};
    if (!name) tempErrors.name = 'Full name is required';
    if (!email) tempErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = 'Invalid email address';
    if (!password) tempErrors.password = 'Password is required';
    else if (password.length < 6) tempErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) tempErrors.confirmPassword = 'Passwords do not match';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');
    try {
      await register(name, email, phone, password, role);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center py-5 my-4">
      <div className="glass-card p-5 w-100 animate-fade-in" style={{ maxWidth: '520px' }}>
        <div className="text-center mb-4">
          <i className="bi-cpu text-primary fs-1 mb-2"></i>
          <h2 className="fw-bold display-font">Create Account</h2>
          <p className="text-secondary small">Begin your customized career preparation journey</p>
        </div>

        {error && (
          <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger rounded-3" role="alert">
            <i className="bi-exclamation-triangle-fill me-2"></i> {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3" role="alert">
            <i className="bi-check-circle-fill me-2"></i> Registration successful! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name input */}
          <div className="mb-3">
            <label className="form-label fw-semibold small">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 text-secondary">
                <i className="bi-person"></i>
              </span>
              <input
                type="text"
                className={`form-control bg-transparent border-start-0 ${errors.name ? 'is-invalid' : ''}`}
                placeholder="John Doe"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: '' }));
                }}
                disabled={loading || success}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
          </div>

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
                disabled={loading || success}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
          </div>

          {/* Phone input */}
          <div className="mb-3">
            <label className="form-label fw-semibold small">Phone (Optional)</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 text-secondary">
                <i className="bi-telephone"></i>
              </span>
              <input
                type="text"
                className="form-control bg-transparent border-start-0"
                placeholder="+1 (555) 019-2834"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading || success}
              />
            </div>
          </div>

          {/* Role selector */}
          <div className="mb-3">
            <label className="form-label fw-semibold small">Account Role</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 text-secondary">
                <i className="bi-person-badge"></i>
              </span>
              <select
                className="form-select bg-transparent border-start-0"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading || success}
              >
                <option value="Student">Student</option>
                <option value="Mentor">Mentor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Passwords */}
          <div className="row g-2 mb-4">
            <div className="col-sm-6">
              <label className="form-label fw-semibold small">Password</label>
              <input
                type="password"
                className={`form-control bg-transparent ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Min 6 chars"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: '' }));
                }}
                disabled={loading || success}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <div className="col-sm-6">
              <label className="form-label fw-semibold small">Confirm Password</label>
              <input
                type="password"
                className={`form-control bg-transparent ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Confirm"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                disabled={loading || success}
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>
          </div>

          {/* Action Button */}
          <button type="submit" className="btn btn-gradient w-100 py-2.5 mb-3" disabled={loading || success}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="text-center mt-3 small">
          <span className="text-secondary">Already have an account? </span>
          <Link to="/login" className="text-primary text-decoration-none fw-semibold">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
