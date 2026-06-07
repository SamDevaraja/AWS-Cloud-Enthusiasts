import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Spinner from '../components/Spinner';
import { isRajalakshmiEmail } from '../utils/validation';

export default function Auth() {
  const navigate = useNavigate();
  const [view, setView] = useState('signin'); // 'signin' | 'signup' | 'forgot'

  // Form States
  const [signInData, setSignInData] = useState({ email: '', password: '', rememberMe: false });
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [forgotEmail, setForgotEmail] = useState('');

  // Password Visibility
  const [showSignInPass, setShowSignInPass] = useState(false);
  const [showSignUpPass, setShowSignUpPass] = useState(false);
  const [showSignUpConfirmPass, setShowSignUpConfirmPass] = useState(false);

  // Status/Feedback States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mockResetLink, setMockResetLink] = useState('');

  // Auto-populate email if "Remember Me" was previously checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setSignInData((prev) => ({ ...prev, email: savedEmail, rememberMe: true }));
    }

    // Redirect if already authenticated
    const token = localStorage.getItem('token');
    if (token) {
      const queryParams = new URLSearchParams(window.location.search);
      const redirectPath = queryParams.get('redirect');
      if (redirectPath) {
        navigate(decodeURIComponent(redirectPath));
      } else {
        navigate('/events');
      }
    }
  }, [navigate]);

  // Handle View switching - clear alerts
  const handleViewChange = (newView) => {
    setError('');
    setSuccess('');
    setMockResetLink('');
    setView(newView);
  };

  // Sign In inputs handler
  const handleSignInChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignInData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Sign Up inputs handler
  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
  };

  // 1. Submit Sign In
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!signInData.email || !signInData.password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isRajalakshmiEmail(signInData.email)) {
      setError('Please sign in with your @rajalakshmi.edu.in email address.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: signInData.email,
        password: signInData.password
      });

      const { token, user } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userName', user.name);

      if (signInData.rememberMe) {
        localStorage.setItem('rememberedEmail', signInData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const redirectPath = queryParams.get('redirect');
        window.location.href = redirectPath ? decodeURIComponent(redirectPath) : '/events';
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Sign Up
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!signUpData.name || !signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (!isRajalakshmiEmail(signUpData.email)) {
      setError('Please use your @rajalakshmi.edu.in email address.');
      return;
    }

    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        name: signUpData.name,
        email: signUpData.email,
        password: signUpData.password
      });

      const { token, user } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userName', user.name);

      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const redirectPath = queryParams.get('redirect');
        window.location.href = redirectPath ? decodeURIComponent(redirectPath) : '/events';
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Submit Forgot Password
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setMockResetLink('');

    if (!forgotEmail) {
      setError('Please provide your email address.');
      return;
    }

    if (!isRajalakshmiEmail(forgotEmail)) {
      setError('Please use your @rajalakshmi.edu.in email address.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email: forgotEmail });
      setSuccess(response.data.message);

      if (response.data.data?.resetLink) {
        setMockResetLink(response.data.data.resetLink);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Verification failed. Email may not exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-panel">
      <div className="form-container-card">

        {/* ── SIGN IN VIEW ── */}
        {view === 'signin' && (
          <div className="view-transition-wrapper">
            <div className="form-header">
              <h2 className="form-title">Welcome back</h2>
              <p className="form-subtitle">Enter your credentials to access your account</p>
            </div>

            {error && (
              <div className="alert-banner error">
                <span>⚠️</span> {error}
              </div>
            )}

            {success && (
              <div className="alert-banner success">
                <span>✨</span> {success}
              </div>
            )}

            <form onSubmit={handleSignInSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="signin-email">Email Address</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="signin-email"
                    name="email"
                    className="form-input"
                    placeholder="email@rajalakshmi.edu.in"
                    value={signInData.email}
                    onChange={handleSignInChange}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signin-password">Password</label>
                <div className="input-wrapper">
                  <input
                    type={showSignInPass ? 'text' : 'password'}
                    id="signin-password"
                    name="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={signInData.password}
                    onChange={handleSignInChange}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowSignInPass((s) => !s)}
                  >
                    {showSignInPass ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="form-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    className="checkbox-input"
                    checked={signInData.rememberMe}
                    onChange={handleSignInChange}
                    disabled={loading}
                  />
                  Remember me
                </label>
              </div>

              <div className="forgot-link-row">
                <span className="link-text" onClick={() => handleViewChange('forgot')}>
                  Forgot password?
                </span>
              </div>

              <button type="submit" className="btn-primary-auth" disabled={loading}>
                {loading ? <Spinner /> : 'Sign In'}
              </button>
            </form>

            <div className="form-footer-switch">
              Don't have an account? 
              <span onClick={() => handleViewChange('signup')}>Sign up</span>
            </div>
          </div>
        )}

        {/* ── SIGN UP VIEW ── */}
        {view === 'signup' && (
          <div className="view-transition-wrapper">
            <div className="form-header">
              <h2 className="form-title">Create account</h2>
              <p className="form-subtitle">Join us to secure your session and get started</p>
            </div>

            {error && (
              <div className="alert-banner error">
                <span>⚠️</span> {error}
              </div>
            )}

            {success && (
              <div className="alert-banner success">
                <span>✨</span> {success}
              </div>
            )}

            <form onSubmit={handleSignUpSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="signup-name">Full Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="signup-name"
                    name="name"
                    className="form-input"
                    placeholder="John Doe"
                    value={signUpData.name}
                    onChange={handleSignUpChange}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signup-email">Email Address</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="signup-email"
                    name="email"
                    className="form-input"
                    placeholder="name@rajalakshmi.edu.in"
                    value={signUpData.email}
                    onChange={handleSignUpChange}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signup-password">Password</label>
                <div className="input-wrapper">
                  <input
                    type={showSignUpPass ? 'text' : 'password'}
                    id="signup-password"
                    name="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={signUpData.password}
                    onChange={handleSignUpChange}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowSignUpPass((s) => !s)}
                  >
                    {showSignUpPass ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signup-confirm-password">Confirm Password</label>
                <div className="input-wrapper">
                  <input
                    type={showSignUpConfirmPass ? 'text' : 'password'}
                    id="signup-confirm-password"
                    name="confirmPassword"
                    className="form-input"
                    placeholder="••••••••"
                    value={signUpData.confirmPassword}
                    onChange={handleSignUpChange}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowSignUpConfirmPass((s) => !s)}
                  >
                    {showSignUpConfirmPass ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary-auth" disabled={loading}>
                {loading ? <Spinner /> : 'Create Account'}
              </button>
            </form>

            <div className="form-footer-switch">
              Already have an account? 
              <span onClick={() => handleViewChange('signin')}>Sign in</span>
            </div>
          </div>
        )}

        {/* ── FORGOT PASSWORD VIEW ── */}
        {view === 'forgot' && (
          <div className="view-transition-wrapper">
            <div className="form-header">
              <h2 className="form-title">Reset password</h2>
              <p className="form-subtitle">Enter your email and we'll send you a password recovery link</p>
            </div>

            {error && (
              <div className="alert-banner error">
                <span>⚠️</span> {error}
              </div>
            )}

            {success && (
              <div className="forgot-success">
                <p className="forgot-success-text">🔑 {success}</p>
                {mockResetLink && (
                  <div style={{ marginTop: '8px' }}>
                    <a
                      href={mockResetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="forgot-success-link"
                    >
                      {mockResetLink}
                    </a>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleForgotSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="forgot-email">Email Address</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="forgot-email"
                    className="form-input"
                    placeholder="name@rajalakshmi.edu.in"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary-auth" disabled={loading}>
                {loading ? <Spinner /> : 'Send Reset Link'}
              </button>
            </form>

            <div className="form-footer-switch">
              Remember your credentials? 
              <span onClick={() => handleViewChange('signin')}>Sign in</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
