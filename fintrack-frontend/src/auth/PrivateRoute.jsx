import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

/*
PrivateRoute protects routes by:
- Waiting for Firebase auth to finish loading
- Redirecting unauthenticated users to /login
Usage:
<Route path="/summary" element={<PrivateRoute><SummaryPage /></PrivateRoute>} />
*/

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  // While auth state is loading, show a simple loading screen
  if (loading) {
    return (
      <div className="page-wrap center-content">
        <div className="spinner" />
        <p className="text-muted">Authenticating...</p>
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated → render protected content
  return children;
}
