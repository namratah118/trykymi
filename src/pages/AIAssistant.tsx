import { useEffect, useState, useRef, FormEvent } from 'react';
import { Send, Trash2, MessageSquare, Sparkles, Bot, User } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { ChatMessage } from '../types/database';

const SUGGESTIONS = [
  'Help me plan my day',
  'Give me productivity tips',
  'Suggest a morning routine',
  'How can I build better habits?',
  'Tips for better sleep',
  'How to reduce stress?',
];

export default function AIAssistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!user) return;
    fetchMessages();
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: true })
      .limit(100);
    setMessages(data || []);
    setLoading(false);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || sending) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      user_id: user!.id,
      role: 'user',
      content: content.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSending(true);

    await supabase.from('chat_messages').insert({
      user_id: user!.id,
      role: 'user',
      content: content.trim(),
    });

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const { data: { session } } = await supabase.auth.getSession();

      const recentMessages = [...messages.slice(-8), userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch(`${supabaseUrl}/functions/v1/ai-assistant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token || supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'chat',
          message: content.trim(),
          history: recentMessages,
        }),
      });

      const data = await response.json();

      if (response.ok && data.message) {
        const assistantMessage = await supabase.from('chat_messages').insert({
          user_id: user!.id,
          role: 'assistant',
          content: data.message,
        }).select().maybeSingle();

        if (assistantMessage.data) {
          setMessages(prev => [...prev, assistantMessage.data!]);
        }
      } else {
        const errorContent = 'TryKymi AI is getting ready for you.';

        const errRecord = await supabase.from('chat_messages').insert({
          user_id: user!.id,
          role: 'assistant',
          content: errorContent,
        }).select().maybeSingle();

        if (errRecord.data) setMessages(prev => [...prev, errRecord.data!]);
      }
    } catch {
      const errRecord = await supabase.from('chat_messages').insert({
        user_id: user!.id,
        role: 'assistant',
        content: 'TryKymi AI is getting ready for you.',
      }).select().maybeSingle();

      if (errRecord.data) setMessages(prev => [...prev, errRecord.data!]);
    }

    setSending(false);
  };

  const clearHistory = async () => {
    await supabase.from('chat_messages').delete().eq('user_id', user!.id);
    setMessages([]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <AppLayout title="AI Assistant" subtitle="Powered by GPT-4o mini">
      <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-5rem)]">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(211,150,140,0.15)' }}
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#D3968C' }} />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-body font-semibold truncate" style={{ color: '#F7F4D5' }}>TryKymi</p>
              <p className="text-xs font-body truncate" style={{ color: 'rgba(247,244,213,0.45)' }}>Your AI assistant</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={clearHistory} className="btn-ghost text-xs">
              <Trash2 className="w-3.5 h-3.5" />
              Clear chat
            </button>
          )}
        </div>

        <div
          className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4"
          style={{ background: 'rgba(247,244,213,0.05)', border: '1px solid rgba(247,244,213,0.10)', borderRadius: '14px' }}
        >
          {loading ? (
            <PageLoader />
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-8">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(211,150,140,0.15)', border: '1px solid rgba(211,150,140,0.25)' }}
              >
                <MessageSquare className="w-8 h-8" style={{ color: '#D3968C' }} />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2" style={{ color: '#F7F4D5' }}>Start a conversation</h3>
              <p className="text-sm font-body mb-6 max-w-sm" style={{ color: 'rgba(247,244,213,0.55)' }}>
                Ask me anything about productivity, habits, planning, or lifestyle improvement.
              </p>
              <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="text-left px-3 py-2.5 rounded-xl text-xs font-body transition-all"
                    style={{ background: 'rgba(247,244,213,0.04)', border: '1px solid rgba(247,244,213,0.08)', color: 'rgba(247,244,213,0.75)' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(211,150,140,0.08)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(211,150,140,0.20)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(247,244,213,0.04)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(247,244,213,0.08)';
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={message.role === 'user'
                      ? { background: '#D3968C' }
                      : { background: 'rgba(247,244,213,0.06)', border: '1px solid rgba(247,244,213,0.10)' }
                    }
                  >
                    {message.role === 'user'
                      ? <User className="w-3.5 h-3.5" style={{ color: '#0A3323' }} />
                      : <Bot className="w-3.5 h-3.5" style={{ color: 'rgba(247,244,213,0.75)' }} />
                    }
                  </div>
                  <div
                    className="max-w-[78%] rounded-2xl px-4 py-3"
                    style={message.role === 'user'
                      ? { background: '#D3968C', color: '#0A3323', borderTopRightRadius: '4px' }
                      : { background: 'rgba(247,244,213,0.05)', border: '1px solid rgba(247,244,213,0.10)', color: '#F7F4D5', borderTopLeftRadius: '4px' }
                    }
                  >
                    <p className="text-sm font-body whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: message.role === 'user' ? 'rgba(10,51,35,0.65)' : 'rgba(247,244,213,0.40)' }}
                    >
                      {new Date(message.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(131,153,88,0.14)', border: '1px solid rgba(247,244,213,0.14)' }}
                  >
                    <Bot className="w-3.5 h-3.5" style={{ color: 'rgba(247,244,213,0.75)' }} />
                  </div>
                  <div
                    className="rounded-2xl px-4 py-3"
                    style={{ background: 'rgba(247,244,213,0.05)', border: '1px solid rgba(247,244,213,0.10)', borderTopLeftRadius: '4px' }}
                  >
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'rgba(211,150,140,0.60)', animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'rgba(211,150,140,0.60)', animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'rgba(211,150,140,0.60)', animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {messages.length > 0 && !sending && (
          <div className="flex flex-wrap gap-2 my-3 flex-shrink-0">
            {SUGGESTIONS.slice(0, 3).map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs px-3 py-1.5 rounded-full font-body transition-all"
                style={{ background: 'rgba(247,244,213,0.04)', border: '1px solid rgba(247,244,213,0.10)', color: 'rgba(247,244,213,0.65)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(211,150,140,0.35)';
                  (e.currentTarget as HTMLElement).style.color = '#D3968C';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(247,244,213,0.10)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(247,244,213,0.65)';
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-shrink-0 flex gap-2 mt-2 w-full">
          <div className="flex-1 relative min-w-0">
            <textarea
              ref={inputRef}
              className="input-field resize-none pr-4 py-3 min-h-[46px] max-h-32 w-full"
              placeholder="Ask anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={sending}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="btn-primary px-3 sm:px-4 self-end flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-xs font-body text-center mt-2 flex-shrink-0 w-full" style={{ color: 'rgba(247,244,213,0.35)' }}>
          Press Enter to send
        </p>
      </div>
    </AppLayout>
  );
}
