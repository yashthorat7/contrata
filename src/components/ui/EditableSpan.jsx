'use client';
import React, { useEffect, useRef } from 'react';

export function EditableSpan({ value, onChange, placeholder, nextRef, inputRef, onKeyDown, maxLength, className = '' }) {
  const internalRef = useRef(null);
  const spanRef = inputRef || internalRef;
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (spanRef.current && spanRef.current.textContent !== (value || '')) {
      spanRef.current.textContent = value || '';
    }
    prevValueRef.current = value;
  }, [value, spanRef]);

  const handleInput = e => {
    const text = e.currentTarget.textContent || '';
    prevValueRef.current = text;
    onChange?.(text);
  };

  const handleBlur = e => {
    const text = (e.currentTarget.textContent || '').trim();
    if (!text) {
      e.currentTarget.textContent = '';
    }
    onChange?.(e.currentTarget.textContent || '');
  };

  const handlePaste = e => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleKeyDown = e => {
    if (maxLength && (e.currentTarget.textContent || '').length >= maxLength) {
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
      ref={spanRef}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onInput={handleInput}
      onBlur={handleBlur}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      data-placeholder={placeholder}
      className={`my-0.5 inline-block max-w-full min-w-fit cursor-text rounded-md border border-transparent bg-white px-1.5 py-1 text-sm leading-normal font-normal break-words text-neutral-800 transition-colors outline-none select-text empty:before:text-neutral-400 empty:before:content-[attr(data-placeholder)] hover:border-neutral-200 focus:border-neutral-400 focus:ring-0 focus:outline-none ${className}`}
    />
  );
}
