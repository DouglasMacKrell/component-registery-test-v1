'use client';
import React from "react";

type Props = { label: string; href: string; variant?: "primary" | "secondary" };

function CTABase({ label, href, variant = "primary" }: Props) {
  const baseStyles = {
    display: 'inline-block',
    padding: '0.875rem 2rem',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    textAlign: 'center' as const,
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    border: 'none',
    minWidth: '140px',
    letterSpacing: '-0.01em',
    position: 'relative' as const,
    overflow: 'hidden' as const
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      color: '#ffffff',
      boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)'
    },
    secondary: {
      backgroundColor: '#ffffff',
      color: '#3b82f6',
      border: '2px solid #3b82f6',
      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)'
    }
  };

  const hoverStyles = {
    primary: {
      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)'
    },
    secondary: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
    }
  };

  return (
    <a 
      href={href} 
      aria-label={label}
      style={{
        ...baseStyles,
        ...variantStyles[variant]
      }}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, hoverStyles[variant]);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, {
          ...baseStyles,
          ...variantStyles[variant]
        });
      }}
    >
      {label}
    </a>
  );
}

const CTA = Object.assign(React.memo(CTABase), { displayName: "CTA" });
export default CTA;