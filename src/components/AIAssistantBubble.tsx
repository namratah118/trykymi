import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export function AIAssistantBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="ai-assistant-bubble"
        aria-label="Open AI Assistant"
      >
        <Sparkles className="ai-assistant-icon" />
      </button>

      {isOpen && (
        <div className="ai-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="ai-modal-content" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setIsOpen(false)}
              className="modal-close absolute top-4 right-4 text-gray-400 hover:text-white"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Hi, I'm TryKymi AI</h2>
              <p className="text-gray-300">Your personal productivity assistant. I'm here to help you optimize your daily routine and achieve your goals with intelligent insights.</p>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors">
                  Get Started
                </button>
                <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
