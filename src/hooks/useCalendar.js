import { useState, useEffect } from 'react';

export function useCalendar({ value, onChange }) {
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

  return {
    year,
    month,
    daysInMonth,
    firstDayOfMonth,
    handlePrevMonth,
    handleNextMonth,
    handleDayClick,
    isSelected,
    isToday
  };
}
