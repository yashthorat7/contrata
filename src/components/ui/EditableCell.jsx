'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Edit, ExternalLink } from './Icons';
import { DatePicker } from './DatePicker';

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

  const commonClasses = `w-full bg-transparent px-0 py-0 text-sm text-neutral-900 outline-none ${className}`;

  if (!isFocused && type !== 'link' && type !== 'date') {
    return (
      <div
        onClick={() => setIsFocused(true)}
        className={`cursor-text ${type === 'textarea' ? 'w-full truncate' : 'whitespace-nowrap'} bg-transparent px-0 py-0 text-sm outline-none ${localVal ? 'text-neutral-900' : 'text-neutral-400'} ${className}`}>
        {localVal || placeholder || '...'}
      </div>
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
          spellCheck={false}
          className={commonClasses}
        />
      );
    }
    if (value && value !== '#') {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="flex items-center text-neutral-900 hover:text-neutral-700">
          <ExternalLink className="h-4 w-4" strokeWidth={1.25} />
        </a>
      );
    }
    return (
      <button onClick={() => setIsFocused(true)} className="text-neutral-400 hover:text-neutral-900">
        <Edit className="h-4 w-4" strokeWidth={1.25} />
      </button>
    );
  }

  if (type === 'date') {
    return (
      <DatePicker
        value={localVal}
        onChange={val => {
          setLocalVal(val);
          onSave(val);
        }}
        placeholder={placeholder}
        className="w-full"
        triggerClassName={`flex w-full cursor-pointer items-center justify-between bg-transparent text-[13px] text-neutral-900 outline-none hover:bg-neutral-50 rounded px-1 -mx-1 py-0.5 transition-colors ${className}`}
      />
    );
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={localVal}
      onChange={e => setLocalVal(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      spellCheck={false}
      className={commonClasses}
    />
  );
}
