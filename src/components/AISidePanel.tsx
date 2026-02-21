import { askKymi } from "../../lib/grok";
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  text: string;
}

export function AISidePanel() {
  const { user } = useAuth();
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

  useEffect(() => {
    if (user && isExpanded) {
      loadChatHistory();
    }
  }, [user, isExpanded]);

  const loadChatHistory = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(20);

    if (data && data.length > 0) {
      const historyMessages = data.map(msg => ({
        id: msg.id,
        type: msg.role as 'user' | 'assistant',
        text: msg.content
      }));
      setMessages(historyMessages);
    }
  };

  const handleSend = async () => {

if (!input) return;

const userMessage = input;

setMessages(prev => [
...prev,
{ role: "user", content: userMessage }
]);

setInput("");

const reply = await askKimi(userMessage);

setMessages(prev => [
...prev,
{ role: "assistant", content: reply }
]);

}

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
