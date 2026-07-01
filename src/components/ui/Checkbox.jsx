import React from 'react';
import { CheckIcon } from '@heroicons/react/16/solid';

export function Checkbox({ checked, onChange, label, id, className = '', ...props }) {
  return (
    <label
      htmlFor={id}
      className={`relative flex cursor-pointer items-center gap-2 text-sm font-medium text-neutral-800 select-none ${className}`}>
      <input type="checkbox" id={id} checked={checked} onChange={onChange} aria-checked={checked} className="peer sr-only" {...props} />
      <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-neutral-300 bg-white transition-colors peer-checked:border-neutral-400 peer-checked:bg-white peer-focus-visible:border-neutral-400 peer-focus-visible:ring-0 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
        {checked && <CheckIcon className="h-3.5 w-3.5 text-neutral-800" />}
      </div>
      {label && <span>{label}</span>}
    </label>
  );
}
