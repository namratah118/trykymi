import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function WelcomeAnimation() {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (user && !sessionStorage.getItem('welcomeShown')) {
      setShowWelcome(true);
      sessionStorage.setItem('welcomeShown', 'true');
    }
  }, [user]);

  if (!showWelcome) return null;

  return (
    <div className="welcome-message">
      <h2>Welcome back, {user?.email?.split('@')[0] || 'there'}</h2>
      <p>Ready to crush your goals today?</p>
    </div>
  );
}
