import React, { useState, useEffect } from 'react';

const sizeClasses = {
  sm: 'h-7 px-3 text-sm',
  default: 'h-8 px-3 text-sm',
  lg: 'h-10 px-4 text-sm',
  icon: 'h-8 w-8 p-0'
};

const variantClasses = {
  primary: 'bg-neutral-800 text-white border border-neutral-800 hover:bg-neutral-700',
  secondary: 'bg-neutral-100 text-neutral-800 border border-neutral-300 hover:bg-neutral-200',
  outline: 'bg-white text-neutral-800 border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400',
  ghost: 'bg-transparent text-neutral-800 border border-transparent hover:bg-neutral-100',
  link: 'bg-transparent text-neutral-800 border border-transparent hover:text-neutral-500 p-0 h-auto'
};

function AnimatedEllipsis() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return <span className="inline-block w-3 text-left tracking-widest">{dots}</span>;
}

export function Button({
  variant = 'primary',
  size = 'default',
  type = 'button',
  disabled = false,
  isLoading = false,
  icon: Icon,
  className = '',
  children,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:border-neutral-400 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.default} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}>
      {isLoading ? (
        <>
          {children && <span>{children}</span>}
          <AnimatedEllipsis />
        </>
      ) : (
        <>
          {Icon && <Icon className="h-4 w-4" />}
          {children && <span>{children}</span>}
        </>
      )}
    </button>
  );
}
