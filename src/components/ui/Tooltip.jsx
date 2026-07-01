import React from 'react';

export function Tooltip({ content, children, className = '', open = false }) {
  return (
    <div className={`group relative inline-block ${className}`}>
      {children}
      <div
        className={`pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs font-medium whitespace-nowrap text-neutral-800 shadow-none transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
        {content}
      </div>
    </div>
  );
}
