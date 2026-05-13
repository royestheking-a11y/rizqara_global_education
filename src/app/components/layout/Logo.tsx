import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ className = '', variant = 'dark', size = 'md' }: LogoProps) {
  const isLight = variant === 'light';
  
  const sizeStyles = {
    sm: {
      brand: 'text-lg md:text-xl',
      sub: 'text-[8px] md:text-[9px]',
      gap: 'mt-0.5'
    },
    md: {
      brand: 'text-xl md:text-2xl',
      sub: 'text-[10px] md:text-[11px]',
      gap: 'mt-1'
    },
    lg: {
      brand: 'text-3xl md:text-4xl',
      sub: 'text-xs md:text-sm',
      gap: 'mt-1.5'
    },
    xl: {
      brand: 'text-4xl md:text-5xl',
      sub: 'text-sm md:text-base',
      gap: 'mt-2'
    }
  };

  const currentSize = sizeStyles[size];

  return (
    <div className={`flex flex-col leading-none select-none no-zoom ${className}`}>
      <div className={`${currentSize.brand} font-black tracking-tighter`}>
        <span style={{ color: isLight ? '#FFFFFF' : '#7B1F2E' }}>Riz</span>
        <span style={{ color: isLight ? '#FFFFFF' : '#7B1F2E', opacity: 0.9 }}>Qara</span>
      </div>
      <div 
        className={`${currentSize.sub} uppercase tracking-[0.25em] font-bold ${currentSize.gap} transition-opacity duration-300 opacity-60 group-hover:opacity-100`}
        style={{ color: isLight ? '#FFFFFF' : '#7B1F2E' }}
      >
        Global Education
      </div>
    </div>
  );
}
