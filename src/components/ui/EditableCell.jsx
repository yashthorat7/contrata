'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Badge } from './Badge';
import { Edit, ExternalLink } from './Icons';

export function EditableCell({ value, onSave, type = 'text', placeholder = '', editLinksMode = false, className = '' }) {
  const [isFocused, setIsFocused] = useState(false);
  const [localVal, setLocalVal] = useState(value || '');
  const inputRef = useRef(null);

  useEffect(() => {
    setLocalVal(value || '');
  }, [value]);

  useEffect(() => {
    if (isFocused) inputRef.current?.focus();
  }, [isFocused]);

  const handleBlur = e => {
    setIsFocused(false);
    if (e.target.value !== value) onSave(e.target.value);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') e.target.blur();
  };

  const commonClasses = `w-full bg-transparent px-2 py-1 text-sm text-neutral-900 outline-none ${className}`;

  if (!isFocused && type !== 'link') {
    return (
      <input
        type="text"
        readOnly
        value={localVal}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder || '...'}
        className={`w-full cursor-text truncate bg-transparent px-2 py-1 text-sm text-neutral-500 outline-none ${className}`}
      />
    );
  }

  if (type === 'link') {
    if (editLinksMode || isFocused) {
      return (
        <input
          ref={inputRef}
          type="text"
          value={localVal}
          onChange={e => setLocalVal(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Paste URL'}
          className={commonClasses}
        />
      );
    }
    if (value && value !== '#') {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="flex items-center text-neutral-500 hover:text-neutral-900">
          <ExternalLink className="h-4 w-4" />
        </a>
      );
    }
    return (
      <button onClick={() => setIsFocused(true)} className="text-neutral-400 hover:text-neutral-900">
        <Edit className="h-4 w-4" />
      </button>
    );
  }

  return (
    <input
      ref={inputRef}
      type={type === 'date' ? 'date' : 'text'}
      value={localVal}
      onChange={e => setLocalVal(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={commonClasses}
    />
  );
}
