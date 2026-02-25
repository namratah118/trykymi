import BetaPopup from "./components/BetaPopup";
<div style={{
background:"#D3968C",
color:"#0A3323",
padding:"8px",
textAlign:"center",
fontWeight:"500"
}}>
Beta Version • TryKymi is improving daily
</div>
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageTransition } from './components/PageTransition';
import { LoadingFallback } from './components/ui/LoadingFallback';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Homepage from './pages/Homepage';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Reminders from './pages/Reminders';
import Tasks from './pages/Tasks';
import Habits from './pages/Habits';
import AIAssistant from './pages/AIAssistant';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import DailyDebrief from './pages/DailyDebrief';
import Profile from './pages/Profile';
import LoadingSpinner from './components/ui/LoadingSpinner';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (!user) {
    if (loading) {
      return <LoadingFallback />;
    }
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <PageTransition>
      import BetaPopup from "./components/BetaPopup";

function App() {

  return (

    <Router>

      <BetaPopup />

      <AppRoutes />

    </Router>

  );

}

export default App;
      <Routes>
        <Route path="/" element={<PublicRoute><Homepage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/habits" element={<ProtectedRoute><Habits /></ProtectedRoute>} />
        <Route path="/assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/debrief" element={<ProtectedRoute><DailyDebrief /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageTransition>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
