import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  to?: string;
}

export default function Logo({ to = '/' }: LogoProps) {
  const logoContent = (
    <span className="font-heading text-lg sm:text-xl font-semibold" style={{ color: '#F7F4D5' }}>
      Kymi
    </span>
  );

  if (to) {
    return <Link to={to}>{logoContent}</Link>;
  }

  return logoContent;
}
