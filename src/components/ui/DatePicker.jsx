import React from 'react';
import { Dropdown } from './Dropdown';
import { Calendar } from './Calendar';
import { Calendar as CalendarIcon } from './Icons';
import { formatDate, formatRelativeTime } from '../../utils/formatters';

export function DatePicker({ value, onChange, placeholder = 'Select date', className = '', triggerClassName = '', relative = false }) {
  const displayValue = value ? (relative ? formatRelativeTime(value) : formatDate(value)) : placeholder;

  const defaultTrigger =
    'flex h-8 w-full cursor-pointer items-center justify-between rounded-md border border-neutral-300 bg-white px-3 text-[13px] text-neutral-800 outline-none hover:border-neutral-400 focus:border-neutral-900 transition-colors';

  return (
    <Dropdown
      className={className}
      trigger={
        <button type="button" className={triggerClassName || defaultTrigger}>
          <span className="whitespace-nowrap">{displayValue}</span>
        </button>
      }>
      {({ close }) => (
        <div className="w-max rounded-md bg-white">
          <Calendar
            value={value}
            onChange={val => {
              if (onChange) onChange(val);
              close();
            }}
          />
        </div>
      )}
    </Dropdown>
  );
}
