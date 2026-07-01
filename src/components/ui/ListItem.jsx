import React from 'react';
import { XSquare } from './Icons';

export function RemovableListItem({ text, onRemove, className = '' }) {
  return (
    <div className={`group flex items-center justify-between px-2.5 py-0.5 transition-colors hover:bg-neutral-100 ${className}`}>
      <span className="mr-2 truncate text-sm text-neutral-700">{text}</span>
      <button
        type="button"
        onClick={onRemove}
        className="flex-shrink-0 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-neutral-800"
        title="Remove item">
        <XSquare className="h-4 w-4" />
      </button>
    </div>
  );
}
