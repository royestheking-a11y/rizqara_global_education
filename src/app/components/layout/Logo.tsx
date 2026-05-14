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
      img: 'h-8',
      brand: 'text-lg',
      sub: 'text-[8px]',
      gap: 'gap-2'
    },
    md: {
      img: 'h-10',
      brand: 'text-xl',
      sub: 'text-[10px]',
      gap: 'gap-3'
    },
    lg: {
      img: 'h-14',
      brand: 'text-3xl',
      sub: 'text-xs',
      gap: 'gap-4'
    },
    xl: {
      img: 'h-20',
      brand: 'text-4xl',
      sub: 'text-sm',
      gap: 'gap-5'
    }
  };

  const current = sizeStyles[size];

  return (
    <div className={`flex items-center no-zoom select-none ${current.gap} ${className}`}>
      <img 
        src="/mainlogo.png" 
        alt="Logo" 
        className={`${current.img} w-auto object-contain`}
      />
      
      <div className="flex flex-col leading-none">
        <div className={`${current.brand} font-black tracking-tighter`}>
          <span style={{ color: isLight ? '#FFFFFF' : '#7B1F2E' }}>Riz</span>
          <span style={{ color: isLight ? '#FFFFFF' : '#7B1F2E', opacity: 0.9 }}>Qara</span>
        </div>
        <div 
          className={`${current.sub} uppercase tracking-[0.25em] font-bold opacity-60`}
          style={{ color: isLight ? '#FFFFFF' : '#7B1F2E' }}
        >
          Global Education
        </div>
      </div>
    </div>
  );
}
