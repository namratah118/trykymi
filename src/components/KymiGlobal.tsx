import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export function KymiGlobal() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowWelcome(true), 1200);
  }, []);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      <style>{`
        * {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        body {
          animation: kymiGlobalFade 0.6s ease;
        }

        @keyframes kymiGlobalFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .kymi-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0a3323 0%, #105666 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          cursor: pointer;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          z-index: 9998;
          border: none;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .kymi-fab:hover {
          transform: scale(1.15);
          box-shadow: 0 25px 50px rgba(10, 51, 35, 0.4);
        }

        .kymi-fab:active {
          transform: scale(0.96);
        }

        .kymi-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: kymiOverlayFade 0.3s ease;
        }

        @keyframes kymiOverlayFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .kymi-modal {
          background: #fff;
          padding: 30px;
          border-radius: 18px;
          min-width: 280px;
          text-align: center;
          animation: kymiModalSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        @keyframes kymiModalSlide {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .kymi-modal h2 {
          font-size: 20px;
          font-weight: 600;
          color: #0a3323;
          margin: 0 0 12px 0;
        }

        .kymi-modal p {
          font-size: 14px;
          color: #666;
          margin: 0 0 20px 0;
        }

        .kymi-modal-btn {
          background: linear-gradient(135deg, #0a3323 0%, #105666 100%);
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .kymi-modal-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(10, 51, 35, 0.3);
        }

        .kymi-chat-bubble {
          position: fixed;
          bottom: 110px;
          right: 24px;
          background: #fff;
          padding: 16px;
          border-radius: 16px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
          width: 220px;
          animation: kymiChatSlide 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes kymiChatSlide {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .kymi-chat-bubble h3 {
          font-size: 14px;
          font-weight: 600;
          color: #0a3323;
          margin: 0 0 8px 0;
        }

        .kymi-chat-bubble p {
          font-size: 13px;
          color: #666;
          margin: 0 0 12px 0;
        }

        .kymi-chat-btn {
          width: 100%;
          background: #0a3323;
          color: #fff;
          border: none;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .kymi-chat-btn:hover {
          background: #105666;
          transform: translateY(-1px);
        }

        .kymi-toast {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: #0a3323;
          color: #fff;
          padding: 14px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
          animation: kymiToastSlide 0.3s ease;
          z-index: 9999;
        }

        @keyframes kymiToastSlide {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>

      <button
        className="kymi-fab"
        onClick={() => setShowChat(!showChat)}
        title="Kymi Assistant"
      >
        <MessageCircle size={28} />
      </button>

      {showChat && (
        <div className="kymi-chat-bubble">
          <h3>Hi there 👋</h3>
          <p>I'm Kymi, your personal AI assistant. Ready to optimize your day?</p>
          <button
            className="kymi-chat-btn"
            onClick={() => {
              setShowChat(false);
              triggerToast();
            }}
          >
            Plan My Day
          </button>
        </div>
      )}

      {showWelcome && (
        <div className="kymi-overlay" onClick={() => setShowWelcome(false)}>
          <div className="kymi-modal" onClick={e => e.stopPropagation()}>
            <h2>Welcome to TryKymi</h2>
            <p>Silicon Valley Mode Enabled ✨</p>
            <button
              className="kymi-modal-btn"
              onClick={() => setShowWelcome(false)}
            >
              Start Optimizing
            </button>
          </div>
        </div>
      )}

      {showToast && (
        <div className="kymi-toast">
          Success! Your day is planned 🎉
        </div>
      )}
    </>
  );
}
