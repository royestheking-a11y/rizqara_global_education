import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ className = '', variant = 'dark', size = 'md' }: LogoProps) {
  const sizeStyles = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20'
  };

  const currentHeight = sizeStyles[size];

  return (
    <div className={`flex items-center no-zoom select-none ${className}`}>
      <img 
        src="/mainlogo.png" 
        alt="RizQara Global Education" 
        className={`${currentHeight} w-auto object-contain`}
      />
    </div>
  );
}
