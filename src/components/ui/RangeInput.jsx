import React from 'react';
import { ChevronLeft, ChevronRight } from './Icons';

function nearestIdx(steps, val) {
  if (!val) return 0;
  return steps.reduce((best, step, i) => (Math.abs(step - val) < Math.abs(steps[best] - val) ? i : best), 0);
}

export function RangeInput({ steps, format, min, max, onMinChange, onMaxChange }) {
  const minIdx = nearestIdx(steps, min);
  const maxIdx = nearestIdx(steps, max);
  const last = steps.length - 1;

  const rows = [
    {
      label: 'Min',
      val: min,
      dec: () => {
        const n = steps[Math.max(0, minIdx - 1)];
        if (n < max || max === 0) onMinChange(n);
      },
      inc: () => {
        const n = steps[Math.min(last, minIdx + 1)];
        if (n < max || max === 0) onMinChange(n);
      },
      decDis: minIdx === 0,
      incDis: max !== 0 && minIdx >= maxIdx - 1
    },
    {
      label: 'Max',
      val: max,
      dec: () => {
        const n = steps[Math.max(0, maxIdx - 1)];
        if (n > min || min === 0) onMaxChange(n);
      },
      inc: () => onMaxChange(steps[Math.min(last, maxIdx + 1)]),
      decDis: min !== 0 && maxIdx <= minIdx + 1,
      incDis: maxIdx === last
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {rows.map(({ label, val, dec, inc, decDis, incDis }) => (
        <div key={label} className="flex flex-col gap-1">
          <span className="text-[10px] font-medium tracking-wide text-neutral-400 uppercase">{label}</span>
          <div className="flex items-center justify-between rounded-md border border-neutral-300 px-1.5 py-1">
            <button
              type="button"
              onClick={dec}
              disabled={decDis}
              className="flex h-5 w-5 items-center justify-center rounded text-neutral-500 transition hover:bg-neutral-100 disabled:opacity-25">
              <ChevronLeft className="h-3 w-3" />
            </button>
            <span className="text-center text-xs font-medium text-neutral-800 tabular-nums">{format(val)}</span>
            <button
              type="button"
              onClick={inc}
              disabled={incDis}
              className="flex h-5 w-5 items-center justify-center rounded text-neutral-500 transition hover:bg-neutral-100 disabled:opacity-25">
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
