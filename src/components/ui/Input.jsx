import React from 'react';

const sizeClasses = {
  sm: 'h-7 px-2 text-sm',
  default: 'h-8 px-2 text-sm',
  lg: 'h-10 px-3 text-sm'
};

export function Input({ className = '', type = 'text', size = 'default', ...props }) {
  return (
    <input
      type={type}
      className={`flex w-full rounded-md border border-neutral-300 bg-white text-neutral-800 shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:border-neutral-400 focus-visible:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses[size] || sizeClasses.default} ${className}`}
      {...props}
    />
  );
}

export const Textarea = React.forwardRef(({ className = '', onInput, ...props }, ref) => {
  const internalRef = React.useRef(null);

  const handleRef = node => {
    internalRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <textarea
      ref={handleRef}
      onInput={e => {
        if (onInput) onInput(e);
      }}
      className={`flex min-h-[60px] w-full resize-none overflow-auto rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-800 shadow-none transition-colors placeholder:text-neutral-300 focus-visible:border-neutral-400 focus-visible:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';
