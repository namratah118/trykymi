import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  text: string;
}

const DEMO_RESPONSES = [
  "Great! I see you've completed 5 tasks today. Keep up the momentum!",
  "Your productivity is at 82%. Consider taking a short break to recharge.",
  "Based on your habits, I recommend focusing on deep work from 10-12 PM.",
  "You're 15% ahead of your weekly goal. Fantastic progress!",
  "Let's optimize your tomorrow. Which tasks are your top priorities?",
];

export function AISidePanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'assistant', text: 'Hi! I\'m TryKymi AI. How can I help you optimize today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputValue,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const randomResponse = DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        text: randomResponse,
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="ai-side-panel">
      <div className={`ai-panel-pill ${isExpanded ? 'expanded' : ''}`}>
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className="ai-panel-icon"
            aria-label="Open AI Panel"
          >
            <Sparkles size={24} color="rgba(76, 175, 80, 0.9)" />
          </button>
        ) : (
          <div className="ai-panel-content">
            <div className="ai-panel-header">
              <div>
                <h3>
                  TryKymi AI
                  <span className="ai-status"></span>
                </h3>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close AI Panel"
              >
                <X size={18} />
              </button>
            </div>

            <div className="ai-panel-chat">
              {messages.map(msg => (
                <div key={msg.id} className={`ai-message ${msg.type}`}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="ai-typing">
                  <div className="ai-typing-dot"></div>
                  <div className="ai-typing-dot"></div>
                  <div className="ai-typing-dot"></div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="ai-panel-input">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping || !inputValue.trim()}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
