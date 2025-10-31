// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import TransactionsPage from './pages/TransactionsPage';
import SummaryPage from './pages/SummaryPage';
import { AuthProvider } from './auth/AuthProvider';
import { ThemeProvider } from './contexts/ThemeContext';
import PrivateRoute from './auth/PrivateRoute';
import Login from './auth/Login';
import NavShell from './components/NavShell';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  // hide navbar on exact /login path — change to startsWith if you have sub-routes
  const hideNav = location.pathname === '/login';

  return (
    <>
      {!hideNav && <NavShell />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <TransactionsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/summary"
          element={
            <PrivateRoute>
              <SummaryPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}
