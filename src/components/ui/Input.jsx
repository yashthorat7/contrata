import React from 'react';

const sizeClasses = {
  sm: 'h-7 px-2 text-sm',
  default: 'h-8 px-2 text-sm',
  lg: 'h-10 px-3 text-sm'
};

const inputVariants = {
  default: 'border border-neutral-300 bg-white text-neutral-800 placeholder:text-neutral-500 focus-visible:border-neutral-400',
  subtle: 'border border-neutral-200 bg-neutral-50 text-neutral-800 placeholder:text-neutral-300 focus-visible:border-neutral-400',
  panel: 'border border-neutral-200 bg-neutral-50 text-neutral-800 placeholder:text-neutral-300 focus-visible:border-neutral-400',
  ghost: 'border-0 bg-transparent text-neutral-800 placeholder:text-neutral-300 focus-visible:border-0',
  transparent: 'border-0 bg-transparent text-neutral-800 placeholder:text-neutral-300 focus-visible:border-0'
};

const textareaVariants = {
  default: 'border border-neutral-300 bg-white px-2 py-1.5 text-neutral-800 placeholder:text-neutral-300 focus-visible:border-neutral-400',
  subtle: 'border border-neutral-200 bg-neutral-50 p-2.5 text-neutral-800 placeholder:text-neutral-300 focus-visible:border-neutral-400',
  panel: 'border border-neutral-200 bg-neutral-50 p-2.5 text-neutral-800 placeholder:text-neutral-300 focus-visible:border-neutral-400',
  ghost: 'border-0 bg-transparent p-2 text-neutral-800 placeholder:text-neutral-300 focus-visible:border-0',
  transparent: 'border-0 bg-transparent p-2 text-neutral-800 placeholder:text-neutral-300 focus-visible:border-0'
};

export function Input({ className = '', type = 'text', size = 'default', variant = 'default', ...props }) {
  const variantClass = inputVariants[variant] || inputVariants.default;
  return (
    <input
      type={type}
      className={`flex w-full rounded-md shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses[size] || sizeClasses.default} ${variantClass} ${className}`}
      {...props}
    />
  );
}

export const Textarea = React.forwardRef(({ className = '', variant = 'default', onInput, ...props }, ref) => {
  const internalRef = React.useRef(null);

  const handleRef = node => {
    internalRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  const variantClass = textareaVariants[variant] || textareaVariants.default;

  return (
    <textarea
      ref={handleRef}
      onInput={e => {
        if (onInput) onInput(e);
      }}
      className={`flex min-h-[60px] w-full resize-none overflow-auto rounded-md text-sm shadow-none transition-colors focus-visible:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${variantClass} ${className}`}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';
