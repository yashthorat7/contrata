'use client';
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

export function ContextMenu({ visible, x, y, items, onClose }) {
  const menuRef = useRef(null);
  const [coords, setCoords] = useState({ left: x, top: y });

  useLayoutEffect(() => {
    if (!visible || !menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    let left = x;
    let top = y;
    if (x + rect.width > window.innerWidth) left = Math.max(8, window.innerWidth - rect.width - 8);
    if (y + rect.height > window.innerHeight) top = Math.max(8, window.innerHeight - rect.height - 8);
    setCoords({ left, top });
  }, [visible, x, y]);

  useEffect(() => {
    if (!visible) return;
    const handleOutsideClick = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    const handleEscape = e => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return createPortal(
    <div
      ref={menuRef}
      style={{ position: 'fixed', top: `${coords.top}px`, left: `${coords.left}px`, zIndex: 9999 }}
      onBlur={e => {
        if (!menuRef.current?.contains(e.relatedTarget)) {
          onClose?.();
        }
      }}
      tabIndex={-1}
      className="min-w-max overflow-hidden rounded-md border border-neutral-300 bg-white font-sans text-[13px] font-normal shadow-none outline-none">
      {items.map(item => (
        <button
          key={item.label}
          type="button"
          onClick={e => {
            item.onClick(e);
            onClose?.();
          }}
          className="flex w-full cursor-pointer items-center border-0 bg-transparent px-2 py-1.5 text-left text-neutral-700 transition duration-100 outline-none hover:bg-neutral-50">
          <span>{item.label}</span>
        </button>
      ))}
    </div>,
    document.body
  );
}
