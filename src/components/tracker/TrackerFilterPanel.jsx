import React, { useRef, useMemo } from 'react';
import { SalaryRangeFilter } from './SalaryRangeFilter';
import { statusOptions, platformOptions, priorityOptions } from '../../data/trackerConfig';
import { useOutsideClick } from '../../hooks/useOutsideClick';

const SORT_OPTIONS = [
  { label: 'Date Posted (Newest)', value: 'datePosted_desc' },
  { label: 'Date Posted (Oldest)', value: 'datePosted_asc' },
  { label: 'Recently Updated', value: 'updatedAt_desc' },
  { label: 'Date Scraped (Newest)', value: 'dateScraped_desc' },
  { label: 'Match Score (High)', value: 'matchScore_desc' },
  { label: 'Company A → Z', value: 'company_asc' },
  { label: 'Company Z → A', value: 'company_desc' }
];

const LOCATION_TYPES = ['Remote', 'Hybrid', 'Onsite'];

function SectionLabel({ children }) {
  return <p className="mb-1.5 text-[11px] font-semibold tracking-wide text-neutral-400 uppercase">{children}</p>;
}

function PillGroup({ options, selected, onChange, multi = false }) {
  const toggle = val => {
    if (multi) {
      onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]);
    } else {
      onChange(selected === val ? '' : val);
    }
  };
  const isActive = val => (multi ? selected.includes(val) : selected === val);
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors select-none ${
            isActive(opt)
              ? 'border-neutral-800 bg-neutral-800 text-white'
              : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50'
          }`}>
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function TrackerFilterPanel({ triggerRef, onClose, filters, onFiltersChange }) {
  const panelRef = useRef(null);
  const refsToWatch = useMemo(() => [panelRef, triggerRef], [triggerRef]);
  useOutsideClick(refsToWatch, onClose, true, 'mousedown');

  const set = (key, val) => onFiltersChange({ ...filters, [key]: val });

  const activeCount = [
    filters.sort !== '',
    filters.status.length > 0,
    filters.priority.length > 0,
    filters.platform.length > 0,
    filters.locationType.length > 0,
    filters.salaryMin > 0 || filters.salaryMax > 0
  ].filter(Boolean).length;

  return (
    <div ref={panelRef} className="absolute top-full left-0 z-50 mt-1.5 w-[300px] rounded-md border border-neutral-300 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-neutral-800">Filter &amp; Sort</span>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() =>
              onFiltersChange({
                sort: '',
                status: [],
                priority: [],
                platform: [],
                locationType: [],
                salaryMin: 0,
                salaryMax: 0
              })
            }
            className="text-xs text-neutral-400 hover:text-neutral-700">
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <SectionLabel>sort</SectionLabel>
          <div className="flex flex-col gap-0.5">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set('sort', filters.sort === opt.value ? '' : opt.value)}
                className={`flex items-center justify-between rounded px-2 py-1.5 text-left text-xs transition-colors ${
                  filters.sort === opt.value
                    ? 'bg-neutral-100 font-medium text-neutral-900'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800'
                }`}>
                <span>{opt.label}</span>
                {filters.sort === opt.value && <span className="h-1.5 w-1.5 rounded-full bg-neutral-800" />}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-neutral-200" />

        <div>
          <SectionLabel>status</SectionLabel>
          <PillGroup options={statusOptions} selected={filters.status} onChange={v => set('status', v)} multi />
        </div>

        <div>
          <SectionLabel>priority</SectionLabel>
          <PillGroup options={priorityOptions} selected={filters.priority} onChange={v => set('priority', v)} multi />
        </div>

        <div>
          <SectionLabel>platform</SectionLabel>
          <PillGroup options={platformOptions} selected={filters.platform} onChange={v => set('platform', v)} multi />
        </div>

        <div>
          <SectionLabel>work type</SectionLabel>
          <PillGroup options={LOCATION_TYPES} selected={filters.locationType} onChange={v => set('locationType', v)} multi />
        </div>

        <div>
          <SectionLabel>salary</SectionLabel>
          <SalaryRangeFilter
            min={filters.salaryMin}
            max={filters.salaryMax}
            onMinChange={v => set('salaryMin', v)}
            onMaxChange={v => set('salaryMax', v)}
          />
        </div>
      </div>
    </div>
  );
}
