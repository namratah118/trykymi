import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${sizeClasses[size]} animate-slide-up rounded-2xl sm:rounded-3xl shadow-xl`}
        style={{
          background: 'rgba(10,51,35,0.97)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(247,244,213,0.14)',
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(247,244,213,0.08)' }}
        >
          <h2 className="font-heading text-xl font-semibold" style={{ color: '#F7F4D5' }}>{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: 'rgba(247,244,213,0.45)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#F7F4D5';
              (e.currentTarget as HTMLElement).style.background = 'rgba(247,244,213,0.08)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(247,244,213,0.45)';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
