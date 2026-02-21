import { Link } from 'react-router-dom';

interface LogoProps {
  to?: string;
  size?: number;
}

const LOGO_STYLE: React.CSSProperties = {
  fontFamily: "'Sora', system-ui, sans-serif",
  fontWeight: 600,
  fontSize: '18px',
  letterSpacing: '0.04em',
  color: '#F7F4D5',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'color 0.2s ease',
  flexShrink: 0,
};

export default function Logo({ to = '/' }: LogoProps) {
  return (
    <Link
      to={to}
      style={LOGO_STYLE}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.color = '#D3968C';
        const dot = el.querySelector('[data-dot]') as HTMLElement | null;
        if (dot) dot.style.background = '#D3968C';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.color = '#F7F4D5';
        const dot = el.querySelector('[data-dot]') as HTMLElement | null;
        if (dot) dot.style.background = '#D3968C';
      }}
    >
      <span
        data-dot
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#D3968C',
          display: 'inline-block',
          flexShrink: 0,
          transition: 'background 0.2s ease',
        }}
      />
      trykymi
    </Link>
  );
}
