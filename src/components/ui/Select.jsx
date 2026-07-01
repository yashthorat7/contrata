import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

export function Select({ options = [], value, onChange, placeholder = 'Select an option', className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-800 shadow-none transition-colors focus:border-neutral-400 focus:ring-0 focus:outline-none">
        <span className={selectedOption ? '' : 'text-neutral-500'}>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDownIcon className="h-4 w-4 text-neutral-500" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-neutral-300 bg-white shadow-none">
          <ul className="max-h-60 overflow-auto text-sm focus:outline-none">
            {options.map(opt => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`relative cursor-pointer px-2 py-1.5 transition-colors select-none hover:bg-neutral-100 ${
                  value === opt.value ? 'bg-neutral-50 font-medium' : 'text-neutral-800'
                }`}>
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
