import React, { useState, useRef, useEffect } from 'react';
import { getIndianDate } from '../../utils/formatters';
import { statusOptions, platformOptions, priorityOptions, trackerColumns as columns } from '../../data/trackerConfig';
import { BadgeDropdown } from '../ui/BadgeDropdown';
import { DatePicker } from '../ui/DatePicker';
import { TableRow, TableCell } from '../ui/Table';

const getInitialDraft = () => ({
  company: '',
  role: '',
  status: 'Not Started',
  platform: 'Direct',
  priority: 'Medium',
  location: '',
  datePosted: getIndianDate(),
  dateScraped: getIndianDate(),
  salary: '',
  notes: '',
  postingLink: '',
  applyLink: ''
});

export default function TrackerAddRow({ addJob }) {
  const [templateDraft, setTemplateDraft] = useState(getInitialDraft());
  const tplRowRef = useRef(null);

  useEffect(() => {
    const handleDocumentClick = e => {
      if (tplRowRef.current && !tplRowRef.current.contains(e.target)) {
        commitTemplateDraft();
      }
    };
    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [templateDraft]);

  const updateTemplateDraft = (field, value) => {
    setTemplateDraft(prev => ({ ...prev, [field]: value }));
  };

  const commitTemplateDraft = () => {
    if (!templateDraft.company.trim() && !templateDraft.role.trim()) return;

    addJob({
      company: templateDraft.company.trim() || 'New Company',
      role: templateDraft.role.trim() || 'Software Engineer',
      status: templateDraft.status,
      platform: templateDraft.platform,
      priority: templateDraft.priority,
      location: templateDraft.location.trim() || 'Remote',
      datePosted: templateDraft.datePosted || getIndianDate(),
      dateScraped: templateDraft.dateScraped || getIndianDate(),
      salary: templateDraft.salary,
      postingLink: templateDraft.postingLink?.trim() || '',
      applyLink: templateDraft.applyLink?.trim() || '',
      notes: templateDraft.notes.trim()
    });

    setTemplateDraft(getInitialDraft());
  };

  const handleTemplateKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitTemplateDraft();
    }
  };

  return (
    <TableRow
      ref={tplRowRef}
      className="bg-neutral-50/20 opacity-0 transition-opacity duration-200 focus-within:opacity-100 hover:bg-neutral-50/45 hover:opacity-100">
      <TableCell className="!px-0 whitespace-nowrap" style={{ width: 39, minWidth: 39, maxWidth: 39 }} />
      {columns.map((col, idx) => {
        const cellValue = templateDraft[col.key] || '';
        return (
          <TableCell
            key={`tpl-${col.key}`}
            className={`${idx === columns.length - 1 ? '!px-0 ' : ''}${col.key === 'notes' ? 'max-w-[300px] min-w-[200px] truncate' : 'whitespace-nowrap'}`}>
            {['status', 'priority', 'platform'].includes(col.type) ? (
              <BadgeDropdown
                current={cellValue}
                onSave={val => updateTemplateDraft(col.key, val)}
                options={col.type === 'status' ? statusOptions : col.type === 'priority' ? priorityOptions : platformOptions}
              />
            ) : col.type === 'date' ? (
              <DatePicker
                value={cellValue}
                onChange={val => updateTemplateDraft(col.key, val)}
                triggerClassName="w-full bg-transparent px-0 py-0 text-sm text-neutral-900 placeholder-neutral-400 outline-none text-left"
              />
            ) : (
              <input
                type="text"
                value={cellValue}
                onChange={e => updateTemplateDraft(col.key, e.target.value)}
                onKeyDown={handleTemplateKeyDown}
                placeholder={col.placeholder}
                className="w-full bg-transparent px-0 py-0 text-sm text-neutral-900 placeholder-neutral-400 outline-none"
              />
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
}
