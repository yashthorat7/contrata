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
  link: 'bg-transparent text-neutral-400 underline border border-transparent hover:text-neutral-600 !p-0 h-auto'
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

export const Button = React.forwardRef(
  (
    {
      variant = 'primary',
      size = 'default',
      type = 'button',
      disabled = false,
      isLoading = false,
      icon: Icon,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:border-neutral-400 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer';

    return (
      <button
        ref={ref}
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
);
Button.displayName = 'Button';

export const ConfirmButton = React.forwardRef(
  ({ onConfirm, children = 'Reset', confirmText = 'Are you sure?', className = '', ...props }, ref) => {
    const [isConfirming, setIsConfirming] = React.useState(false);
    const internalRef = React.useRef(null);

    const handleRef = node => {
      internalRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    React.useEffect(() => {
      const handleClickOutside = event => {
        if (internalRef.current && !internalRef.current.contains(event.target)) {
          setIsConfirming(false);
        }
      };
      if (isConfirming) document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isConfirming]);

    const handleClick = e => {
      if (isConfirming) {
        if (onConfirm) onConfirm(e);
        setIsConfirming(false);
      } else {
        setIsConfirming(true);
      }
    };

    return (
      <Button
        ref={handleRef}
        onClick={handleClick}
        className={`transition-all duration-300 ease-in-out ${isConfirming ? 'min-w-[130px]' : ''} ${className}`}
        {...props}>
        {isConfirming ? confirmText : children}
      </Button>
    );
  }
);
ConfirmButton.displayName = 'ConfirmButton';
