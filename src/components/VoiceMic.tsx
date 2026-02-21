import { Mic, CheckCircle2 } from 'lucide-react';
import { useVoiceCommands } from '../hooks/useVoiceCommands';

interface VoiceMicProps {
  userId: string | undefined;
}

export default function VoiceMic({ userId }: VoiceMicProps) {
  const { status, startListening, lastTask, showNotification } = useVoiceCommands(userId);

  if (!userId) return null;

  const isActive = status !== 'idle';

  return (
    <>
      <button
        onClick={startListening}
        disabled={isActive}
        className="fixed bottom-6 left-6 w-16 h-16 rounded-full border-none flex items-center justify-center text-2xl z-50 transition-all hover:shadow-lg active:scale-95 disabled:opacity-75"
        style={{
          background: '#D3968C',
          color: 'white',
          cursor: isActive ? 'default' : 'pointer'
        }}
        aria-label="Voice command"
      >
        {isActive ? (
          <span className="animate-pulse text-xs text-center px-2">
            {status === 'listening' ? 'Listening...' : 'Processing...'}
          </span>
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>

      {status !== 'idle' && (
        <div className="fixed bottom-32 left-6 z-50 animate-in slide-in-from-bottom-4 duration-300 px-4 py-3 rounded-lg" style={{ background: '#0A3323', color: '#D3968C', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid #2C7A6F' }}>
          <p className="text-sm font-medium capitalize">{status === 'listening' ? 'Listening...' : 'Processing...'}</p>
        </div>
      )}

      {showNotification && lastTask && (
        <div className="fixed bottom-32 left-6 z-50 animate-in slide-in-from-bottom-4 duration-300 flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: '#F7F4D5', color: '#0A3323', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#2C7A6F' }} />
          <div className="text-sm">
            <p className="font-semibold capitalize">{lastTask.type} added</p>
            <p className="opacity-80 line-clamp-1">{lastTask.content}</p>
          </div>
        </div>
      )}
    </>
  );
}
