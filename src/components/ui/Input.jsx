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

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`flex min-h-[60px] w-full resize-none rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-800 shadow-none transition-colors placeholder:text-neutral-500 focus-visible:border-neutral-400 focus-visible:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
