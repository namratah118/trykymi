import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PageTransition } from './components/PageTransition';
import { AIAssistantBubble } from './components/AIAssistantBubble';
import { CursorGlow } from './components/CursorGlow';
import { FloatingParticles } from './components/FloatingParticles';
import { AISidePanel } from './components/AISidePanel';
import { AmbientLight } from './components/AmbientLight';
import { WelcomeAnimation } from './components/WelcomeAnimation';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Homepage from './pages/Homepage';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import TodaysPlan from './pages/TodaysPlan';
import Reminders from './pages/Reminders';
import Tasks from './pages/Tasks';
import Habits from './pages/Habits';
import AIAssistant from './pages/AIAssistant';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import DailyDebrief from './pages/DailyDebrief';
import Profile from './pages/Profile';
import Timeline from './pages/Timeline';
import LoadingSpinner from './components/ui/LoadingSpinner';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <PageTransition>
      <Routes>
        <Route path="/" element={<PublicRoute><Homepage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/plan" element={<ProtectedRoute><TodaysPlan /></ProtectedRoute>} />
        <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/habits" element={<ProtectedRoute><Habits /></ProtectedRoute>} />
        <Route path="/assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/debrief" element={<ProtectedRoute><DailyDebrief /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/timeline" element={<ProtectedRoute><Timeline /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </PageTransition>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FloatingParticles />
        <AmbientLight />
        <CursorGlow />
        <AppRoutes />
        <AIAssistantBubble />
        <AISidePanel />
        <WelcomeAnimation />
      </AuthProvider>
    </BrowserRouter>
  );
}
