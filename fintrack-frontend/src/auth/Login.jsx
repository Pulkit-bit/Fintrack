import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import { authErrorMessage } from './authErrors';

export default function Login() {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, loading } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (mode === 'signin') {
        await loginWithEmail(email.trim(), password);
      } else {
        await registerWithEmail(email.trim(), password);
      }
      navigate('/');
    } catch (err) {
      setError(authErrorMessage(err?.code));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setSubmitting(true);

    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError(authErrorMessage(err?.code));
    } finally {
      setSubmitting(false);
    }
  };

  const busy = loading || submitting;

  return (
    <div className="page-wrap" style={{ maxWidth: 420 }}>
      <div className="section-card">
        <h2 className="page-title mb-3 text-center">Welcome to FinTrack</h2>
        <p className="text-center text-muted" style={{ marginTop: -8, fontSize: 'x-large' }}>
          Sign in to continue
        </p>

        {error && (
          <div
            className="alert alert-danger mt-2"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        <button
          type="button"
          className="btn btn-dark w-100 btn-rainbow mt-2"
          onClick={handleGoogle}
          disabled={busy}
        >
          {busy ? 'Please wait…' : 'Continue with Google'}
        </button>

        <div className="text-center text-muted my-3">or</div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-2">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={busy}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={busy}
            />
          </div>

          <button className="btn btn-primary w-100" type="submit" disabled={busy}>
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-3">
          {mode === 'signin' ? (
            <span className="text-muted">
              New here?{' '}
              <button
                className="btn btn-link p-0"
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
                disabled={busy}
              >
                Create an account
              </button>
            </span>
          ) : (
            <span className="text-muted">
              Already have an account?{' '}
              <button
                className="btn btn-link p-0"
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError('');
                }}
                disabled={busy}
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>

      <div className="login-footer-msg">
        Track smarter - Spend wiser.
        Every rupee accounted!<br />
        Start today with FinTrack.
      </div>
    </div>
  );
}
