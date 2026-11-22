import React, { useRef, useMemo } from 'react';
import { SalaryRangeFilter } from './SalaryRangeFilter';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { Checkbox } from '../ui/Checkbox';
import { useTrackerOptions } from '../../hooks/useTrackerOptions';

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
  return <p className="mb-2 text-xs font-medium text-neutral-500">{children}</p>;
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
  const { statusOptions, platformOptions, priorityOptions } = useTrackerOptions();
  const panelRef = useRef(null);
  const refsToWatch = useMemo(() => [panelRef, triggerRef], [triggerRef]);
  useOutsideClick(refsToWatch, onClose, true, 'mousedown');

  const set = (key, val) => onFiltersChange({ ...filters, [key]: val });

  const states = filters.jobState || ['unmarked', 'saved'];
  const unmarkedChecked = states.includes('unmarked');
  const archivedChecked = states.includes('archived');
  const savedChecked = states.includes('saved');

  const handleToggleState = stateVal => {
    let nextStates;
    if (states.includes(stateVal)) {
      nextStates = states.filter(s => s !== stateVal);
    } else {
      nextStates = [...states, stateVal];
    }
    set('jobState', nextStates);
  };

  const handleClearAll = () => {
    onFiltersChange({
      sort: '',
      status: [],
      priority: [],
      platform: [],
      locationType: [],
      salaryMin: 0,
      salaryMax: 0,
      jobState: ['unmarked', 'saved']
    });
  };

  const activeCount = [
    filters.sort !== '',
    filters.status.length > 0,
    filters.priority.length > 0,
    filters.platform.length > 0,
    filters.locationType.length > 0,
    filters.salaryMin > 0 || filters.salaryMax > 0,
    !(states.length === 2 && states.includes('unmarked') && states.includes('saved'))
  ].filter(Boolean).length;

  return (
    <div
      ref={panelRef}
      className="absolute top-full left-0 z-50 mt-1.5 flex h-[80vh] max-h-[80vh] w-[320px] flex-col rounded-md border border-neutral-300 bg-white select-none">
      <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-4 py-3">
        <span className="text-sm font-medium text-neutral-900">Filter &amp; Sort</span>
        <div className="flex items-center gap-3">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-neutral-500 transition-colors hover:text-neutral-900">
              Clear all
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-neutral-400 transition-colors hover:text-neutral-700">
            ✕
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div>
          <SectionLabel>Sort</SectionLabel>
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
          <SectionLabel>Application State</SectionLabel>
          <div className="flex flex-col gap-2">
            <Checkbox
              id="filter-state-unmarked"
              checked={unmarkedChecked}
              onChange={() => handleToggleState('unmarked')}
              label="Unmarked"
            />
            <Checkbox
              id="filter-state-saved"
              checked={savedChecked}
              onChange={() => handleToggleState('saved')}
              label="Saved"
            />
            <Checkbox
              id="filter-state-archived"
              checked={archivedChecked}
              onChange={() => handleToggleState('archived')}
              label="Archived"
            />
          </div>
        </div>

        <hr className="border-neutral-200" />

        <div>
          <SectionLabel>Status</SectionLabel>
          <PillGroup options={statusOptions} selected={filters.status} onChange={v => set('status', v)} multi />
        </div>

        <hr className="border-neutral-200" />

        <div>
          <SectionLabel>Priority</SectionLabel>
          <PillGroup options={priorityOptions} selected={filters.priority} onChange={v => set('priority', v)} multi />
        </div>

        <hr className="border-neutral-200" />

        <div>
          <SectionLabel>Platform</SectionLabel>
          <PillGroup options={platformOptions} selected={filters.platform} onChange={v => set('platform', v)} multi />
        </div>

        <hr className="border-neutral-200" />

        <div>
          <SectionLabel>Work Type</SectionLabel>
          <PillGroup options={LOCATION_TYPES} selected={filters.locationType} onChange={v => set('locationType', v)} multi />
        </div>

        <hr className="border-neutral-200" />

        <div>
          <SectionLabel>Salary Range</SectionLabel>
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
