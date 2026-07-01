'use client';
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export function Dropdown({ trigger, children, align = 'left', className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const toggleDropdown = e => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current || !menuRef.current) return;
    const updatePosition = () => {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      let left = rect.left;
      if (align === 'right' || rect.left + menuRect.width > window.innerWidth) {
        left = Math.max(8, rect.right - menuRect.width);
      }
      let top = rect.bottom + 4;
      if (top + menuRect.height > window.innerHeight) {
        top = rect.top - menuRect.height - 4;
      }
      setCoords({ top, left });
    };
    updatePosition();
    const resizeObserver = new ResizeObserver(() => updatePosition());
    resizeObserver.observe(document.body);
    document.addEventListener('scroll', updatePosition, true);
    return () => {
      resizeObserver.disconnect();
      document.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, align]);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = e => {
      if (menuRef.current && !menuRef.current.contains(e.target) && triggerRef.current && !triggerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = e => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-block ${className}`}>
      <div ref={triggerRef} onClick={toggleDropdown} className="cursor-pointer select-none">
        {trigger}
      </div>
      {isOpen &&
        typeof window !== 'undefined' &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: 'fixed', top: `${coords.top}px`, left: `${coords.left}px`, zIndex: 9999 }}
            onClick={e => e.stopPropagation()}
            className="min-w-max overflow-hidden rounded-md border border-neutral-300 bg-white shadow-none">
            {typeof children === 'function' ? children({ close: () => setIsOpen(false) }) : children}
          </div>,
          document.body
        )}
    </div>
  );
}
