import React from 'react';

const variantClasses = {
  default: 'bg-neutral-100 text-neutral-800 border-neutral-300',
  outline: 'bg-transparent text-neutral-800 border-neutral-300'
};

export function Badge({ variant = 'default', className = '', as: Component = 'span', children, ...props }) {
  const baseClasses =
    'inline-flex items-center rounded-md border px-2 py-0.5 text-sm font-medium whitespace-nowrap transition-colors focus:outline-none select-none';
  return (
    <Component className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className}`} {...props}>
      {children}
    </Component>
  );
}
