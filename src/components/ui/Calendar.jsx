import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { ChevronLeft, ChevronRight } from './Icons';

export function Calendar({ value, onChange, className = '' }) {
  const parseValue = val => {
    if (!val) return new Date();
    const d = new Date(val);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const [currentMonth, setCurrentMonth] = useState(() => parseValue(value));

  useEffect(() => {
    if (value) {
      setCurrentMonth(parseValue(value));
    }
  }, [value]);

  const selectedDate = value ? parseValue(value) : null;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const handleDayClick = day => {
    const d = new Date(year, month, day);
    // format to local tiime
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    if (onChange) onChange(`${y}-${m}-${dd}`);
  };

  const isSelected = day => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
  };

  const isToday = day => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square h-7 w-7" />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const active = isSelected(d);
    const today = isToday(d);
    days.push(
      <button
        key={d}
        type="button"
        onClick={() => handleDayClick(d)}
        className={`flex aspect-square h-7 w-7 cursor-pointer items-center justify-center rounded-md text-[12px] transition-all duration-150 focus:outline-none ${
          active
            ? 'bg-neutral-900 font-medium text-white shadow-sm'
            : today
              ? 'bg-neutral-100 font-medium text-neutral-900 hover:bg-neutral-200'
              : 'text-neutral-700 hover:bg-neutral-100'
        }`}>
        {d}
      </button>
    );
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  return (
    <div className={`w-[216px] p-2.5 font-sans select-none ${className}`}>
      <div className="mb-2 flex items-center justify-between px-1">
        <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-500 hover:text-neutral-900" onClick={handlePrevMonth}>
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Button>
        <div className="text-[13px] font-medium tracking-tight text-neutral-800">
          {monthNames[month]} {year}
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-500 hover:text-neutral-900" onClick={handleNextMonth}>
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Button>
      </div>
      <div className="mb-1 grid grid-cols-7 gap-0 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
          <div
            key={idx}
            className="flex aspect-square h-7 w-7 items-center justify-center text-[11px] font-medium text-neutral-400 uppercase">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0">{days}</div>
    </div>
  );
}
