import React, { useState, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { useOutsideClick } from '../../hooks/useOutsideClick';

export function Select({ options = [], value, onChange, placeholder = 'Select an option', className = '', buttonClassName = '', hideChevron = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmingValue, setConfirmingValue] = useState(null);
  const containerRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useOutsideClick(
    [containerRef],
    () => {
      setIsOpen(false);
      setConfirmingValue(null);
    },
    isOpen
  );

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) setConfirmingValue(null);
        }}
        className={`flex h-8 w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-800 shadow-none transition-colors focus:border-neutral-400 focus:ring-0 focus:outline-none ${buttonClassName}`}>
        <span className={`truncate text-left ${selectedOption ? '' : 'text-neutral-500'}`}>{selectedOption ? selectedOption.label : placeholder}</span>
        {!hideChevron && <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 text-neutral-500" />}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-neutral-300 bg-white shadow-none">
          <ul className="max-h-60 overflow-auto text-sm focus:outline-none">
            {options.map(opt => (
              <li
                key={opt.value}
                onClick={e => {
                  if (opt.confirm && confirmingValue !== opt.value) {
                    e.stopPropagation();
                    setConfirmingValue(opt.value);
                  } else {
                    onChange(opt.value);
                    setIsOpen(false);
                    setConfirmingValue(null);
                  }
                }}
                className={`relative cursor-pointer px-2 py-1.5 transition-colors select-none hover:bg-neutral-100 ${
                  value === opt.value ? 'bg-neutral-50 font-medium' : 'text-neutral-800'
                }`}>
                {confirmingValue === opt.value ? 'Are you sure?' : opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
