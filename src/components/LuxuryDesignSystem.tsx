import React, { useEffect, useState } from 'react';

export function LuxuryDesignSystem() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <style>{`
      /* ========================================= */
      /* STRIPE-LEVEL LUXURY DESIGN SYSTEM */
      /* Premium • Minimal • Refined */
      /* ========================================= */

      /* Typography System */
      body, html {
        font-family: 'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }

      h1, h2, h3, h4, h5, h6 {
        font-family: 'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif;
        font-weight: 600;
        letter-spacing: -0.02em;
        line-height: 1.2;
      }

      h1 {
        font-size: 32px;
        font-weight: 700;
        letter-spacing: -0.03em;
      }

      h2 {
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.025em;
      }

      h3 {
        font-size: 22px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }

      h4 {
        font-size: 18px;
        font-weight: 600;
        letter-spacing: -0.015em;
      }

      p, body, span, label {
        font-size: 16px;
        font-weight: 400;
        letter-spacing: -0.005em;
        line-height: 1.6;
        color: #0A3323;
      }

      /* Luxury Color System - Remove all blue, only use palette */
      :root {
        --primary-dark: #0A3323;
        --secondary-green: #839958;
        --accent-pink: #D3968C;
        --background-cream: #F7F4D5;
        --highlight-teal: #105666;
      }

      /* Glassy Navigation */
      nav, [role="navigation"], .navbar, .nav-bar, .navbar-top {
        position: sticky;
        top: 0;
        z-index: 1000;
        background: rgba(10, 51, 35, 0.6);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(247, 244, 213, 0.1);
        box-shadow: ${scrolled ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'};
        transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        padding: 0 24px;
        height: 64px;
      }

      /* Glassy Navbar Content */
      nav::before,
      nav::after,
      [role="navigation"]::before,
      [role="navigation"]::after,
      .navbar::before,
      .navbar::after {
        content: '';
      }

      /* Luxury Premium Cards */
      .card,
      [class*="card"],
      [role="region"],
      section > div,
      .dashboard-section,
      .widget,
      .container > div > div {
        border-radius: 18px !important;
        background: #F7F4D5 !important;
        padding: 24px !important;
        margin-bottom: 24px;
        transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .card:hover,
      [class*="card"]:hover,
      section > div:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
      }

      /* Buttons - Pill Shape */
      button,
      input[type="button"],
      input[type="submit"],
      [role="button"],
      .btn,
      .button {
        border-radius: 999px !important;
        background: #0A3323 !important;
        color: #F7F4D5 !important;
        font-family: 'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif;
        font-weight: 600;
        font-size: 14px;
        padding: 12px 24px !important;
        border: none !important;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      button:hover:not(:disabled),
      input[type="button"]:hover:not(:disabled),
      input[type="submit"]:hover:not(:disabled),
      [role="button"]:hover:not(:disabled),
      .btn:hover:not(:disabled),
      .button:hover:not(:disabled) {
        background: #105666 !important;
        box-shadow: 0 8px 16px rgba(10, 51, 35, 0.2);
        transform: translateY(-2px);
      }

      button:active,
      input[type="button"]:active,
      input[type="submit"]:active {
        transform: scale(0.96);
      }

      /* Secondary Buttons */
      .btn-secondary,
      .button-secondary,
      button.secondary {
        background: transparent !important;
        border: 1.5px solid #839958 !important;
        color: #0A3323 !important;
      }

      .btn-secondary:hover,
      .button-secondary:hover,
      button.secondary:hover {
        background: rgba(131, 153, 88, 0.1) !important;
        border-color: #839958 !important;
      }

      /* Inputs - Soft Cream Background */
      input,
      textarea,
      select,
      [role="textbox"],
      .input,
      .input-field {
        background: #F7F4D5 !important;
        color: #0A3323 !important;
        border: 1.5px solid #839958 !important;
        border-radius: 12px !important;
        padding: 12px 14px !important;
        font-family: 'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif;
        font-size: 14px;
        font-weight: 400;
        transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
      }

      input::placeholder,
      textarea::placeholder {
        color: rgba(10, 51, 35, 0.5) !important;
      }

      input:focus,
      textarea:focus,
      select:focus,
      [role="textbox"]:focus,
      .input:focus,
      .input-field:focus {
        background: #F7F4D5 !important;
        border-color: #D3968C !important;
        outline: none !important;
        box-shadow: 0 0 0 3px rgba(211, 150, 140, 0.15) !important;
      }

      /* Smooth Page Transitions */
      * {
        transition: color 0.3s ease, background 0.3s ease;
      }

      main, [role="main"], .page-content, .app-container {
        animation: pageLoad 0.4s ease;
      }

      @keyframes pageLoad {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Spacing Grid 24px */
      * + * {
        margin-block-start: 24px;
      }

      main > *,
      [role="main"] > *,
      section > *,
      .container > * {
        margin-bottom: 24px;
      }

      /* Remove default margins to prevent double spacing */
      h1 + *,
      h2 + *,
      h3 + *,
      p + p {
        margin-block-start: 12px;
      }

      /* Luxury Sidebar */
      aside,
      [role="navigation"] aside,
      .sidebar,
      .nav-sidebar {
        background: #0A3323;
        border-right: 1px solid rgba(247, 244, 213, 0.1);
      }

      aside a,
      .sidebar a,
      [role="navigation"] a {
        color: rgba(247, 244, 213, 0.7);
        transition: all 0.2s ease;
      }

      aside a:hover,
      aside a.active,
      .sidebar a:hover,
      .sidebar a.active {
        color: #F7F4D5;
        background: rgba(131, 153, 88, 0.1);
        border-radius: 8px;
      }

      /* Text Color Adjustments */
      .text-light,
      .text-muted,
      .text-secondary {
        color: rgba(10, 51, 35, 0.6) !important;
      }

      .text-primary {
        color: #0A3323 !important;
      }

      .text-accent {
        color: #D3968C !important;
      }

      .text-success,
      .text-green {
        color: #839958 !important;
      }

      .text-highlight,
      .text-teal {
        color: #105666 !important;
      }

      /* Badge Styling */
      .badge,
      [class*="badge"],
      span[class*="badge"] {
        border-radius: 999px;
        padding: 4px 12px;
        font-size: 12px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .badge-primary {
        background: rgba(10, 51, 35, 0.1);
        color: #0A3323;
      }

      .badge-accent {
        background: rgba(211, 150, 140, 0.15);
        color: #D3968C;
      }

      .badge-green {
        background: rgba(131, 153, 88, 0.15);
        color: #839958;
      }

      /* Section Labels */
      .section-label,
      .label,
      label,
      .field-label {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #839958;
        display: block;
        margin-bottom: 8px;
      }

      /* List Styling */
      ul, ol {
        list-style: none;
        padding: 0;
      }

      li {
        padding: 8px 0;
        border-bottom: 1px solid rgba(10, 51, 35, 0.1);
      }

      li:last-child {
        border-bottom: none;
      }

      /* Focus Visible */
      *:focus-visible {
        outline: 2px solid #D3968C;
        outline-offset: 2px;
      }

      /* Links */
      a {
        color: #105666;
        text-decoration: none;
        transition: all 0.2s ease;
      }

      a:hover {
        color: #D3968C;
      }

      /* Scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        background: transparent;
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(131, 153, 88, 0.3);
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: rgba(131, 153, 88, 0.5);
      }

      /* Selection */
      ::selection {
        background: rgba(211, 150, 140, 0.25);
        color: #0A3323;
      }

      /* Smooth Animations */
      @media (prefers-reduced-motion: no-preference) {
        * {
          transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        h1, h2 { font-size: 24px; }
        h3 { font-size: 18px; }

        .card,
        [class*="card"],
        section > div {
          padding: 16px !important;
        }

        button,
        .btn,
        .button {
          padding: 10px 16px !important;
        }

        nav, .navbar {
          padding: 0 16px;
        }
      }

      /* ========================================= */
      /* END LUXURY DESIGN SYSTEM */
      /* ========================================= */
    `}</style>
  );
}
