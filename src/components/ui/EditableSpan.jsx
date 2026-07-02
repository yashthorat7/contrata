'use client';
import React, { useEffect, useRef } from 'react';

export function EditableSpan({ value, onChange, placeholder, nextRef, inputRef, onKeyDown, maxLength, className = '' }) {
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (inputRef.current && inputRef.current.textContent !== value) {
      inputRef.current.textContent = value || '';
    }
    prevValueRef.current = value;
  }, [value, inputRef]);

  const handleInput = e => {
    const text = e.currentTarget.textContent || '';
    prevValueRef.current = text;
    onChange(text);
  };

  const handleKeyDown = e => {
    // enforce maxLength
    if (maxLength && e.currentTarget.textContent.length >= maxLength) {
      const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Enter'];
      if (!allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef?.current) {
        nextRef.current.focus();
      } else if (onKeyDown) {
        onKeyDown(e);
      } else {
        e.currentTarget.blur();
      }
    } else if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <span
      ref={inputRef}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      data-placeholder={placeholder}
      className={`my-0.5 inline-block max-w-full min-w-fit cursor-text rounded-md border border-transparent bg-white px-1.5 py-1 text-sm leading-normal font-normal break-words text-neutral-800 transition-colors outline-none select-text empty:before:text-neutral-400 empty:before:content-[attr(data-placeholder)] hover:border-neutral-200 focus:border-neutral-400 focus:ring-0 focus:outline-none ${className}`}
    />
  );
}
