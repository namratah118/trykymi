import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function LandingPopup() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") return;

    const popup = document.createElement("div");
    popup.innerHTML = "✨ TryKymi is building • Launching soon";

    Object.assign(popup.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      padding: "12px 18px",
      background: "rgba(0,0,0,0.6)",
      color: "white",
      fontSize: "14px",
      borderRadius: "12px",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
      zIndex: "9999",
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      fontWeight: "500",
      letterSpacing: "0.3px",
      animation: "fadeInUp 0.4s ease-out",
      pointerEvents: "none",
    });

    document.body.appendChild(popup);

    return () => {
      popup.remove();
    };
  }, [location.pathname]);

  return null;
}
