'use client';
import React from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/16/solid';
import { trackerColumns as columns } from '../../data/trackerConfig';
import { EditableCell } from '../ui/EditableCell';
import { BadgeDropdown } from '../ui/BadgeDropdown';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/Table';
import { ContextMenu } from '../ui/ContextMenu';
import { Checkbox } from '../ui/Checkbox';
import TrackerAddRow from './TrackerAddRow';
import { useTrackerOptions } from '../../hooks/useTrackerOptions';
import { useTrackerTable } from '../../hooks/useTrackerTable';

export default function TrackerTable({
  addJob,
  updateJob,
  updateJobsBulk,
  deleteJobsBulk,
  filteredJobs,
  selectedJobIds,
  setSelectedJobIds,
  setSelectedDetailsJobId
}) {
  const { statusOptions, platformOptions, priorityOptions } = useTrackerOptions();
  const { contextMenu, setContextMenu, sortConfig, sortedJobs, handleSort, handleContextMenu, menuItems, toggleSelectAll, toggleSelect } =
    useTrackerTable({
      filteredJobs,
      selectedJobIds,
      setSelectedJobIds,
      deleteJobsBulk,
      updateJobsBulk,
      updateJob,
      setSelectedDetailsJobId
    });

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-2">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: 39, minWidth: 39, maxWidth: 39 }} className="!px-0 text-center font-medium whitespace-nowrap">
              <div className="flex items-center justify-center">
                <Checkbox
                  checked={selectedJobIds.length === filteredJobs.length && filteredJobs.length > 0}
                  onChange={toggleSelectAll}
                  id="select-all"
                />
              </div>
            </TableHead>
            {columns.map((col, idx) => (
              <TableHead
                key={col.key}
                style={{ width: col.width, minWidth: col.width, maxWidth: col.key === '_details' ? col.width : undefined }}
                className={`font-medium whitespace-nowrap ${idx === columns.length - 1 ? 'text-center' : ''} ${col.key !== '_details' ? 'cursor-pointer transition-colors select-none hover:bg-neutral-50/50' : ''}`}
                onClick={() => handleSort(col.key)}>
                <div className={`flex w-full items-center justify-between gap-1 ${idx === columns.length - 1 ? 'justify-center' : ''}`}>
                  <span>{col.label}</span>
                  {sortConfig.key === col.key && (
                    <span className="flex-shrink-0 text-neutral-400">
                      {sortConfig.direction === 'asc' ? (
                        <ChevronUpIcon className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDownIcon className="h-3.5 w-3.5" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedJobs.map((job, index) => (
            <TableRow key={job.id} className="group bg-transparent hover:bg-neutral-50" onContextMenu={e => handleContextMenu(e, job)}>
              <TableCell className="group/cell !px-0 whitespace-nowrap" style={{ width: 39, minWidth: 39, maxWidth: 39 }}>
                {selectedJobIds.includes(job.id) ? (
                  <div className="flex items-center justify-center">
                    <Checkbox checked={true} onChange={() => toggleSelect(job.id)} id={`select-${job.id}`} />
                  </div>
                ) : (
                  <>
                    <div className="hidden items-center justify-center group-focus-within/cell:flex group-hover/cell:flex">
                      <Checkbox checked={false} onChange={() => toggleSelect(job.id)} id={`select-${job.id}`} />
                    </div>
                    <div className="flex items-center justify-center text-xs text-neutral-400 group-focus-within/cell:hidden group-hover/cell:hidden">
                      {index + 1}
                    </div>
                  </>
                )}
              </TableCell>
              {columns.map((col, idx) => (
                <TableCell
                  key={col.key}
                  className={`${col.key === 'notes' ? 'max-w-[300px] min-w-[200px] truncate' : 'whitespace-nowrap'} ${idx === columns.length - 1 ? '!px-0' : ''}`}>
                  {col.type === 'details' ? (
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setSelectedDetailsJobId(job.id)}
                        className="rounded p-0.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700">
                        <DocumentTextIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : ['status', 'priority', 'platform'].includes(col.type) ? (
                    <BadgeDropdown
                      current={job[col.key]}
                      onSave={val => updateJob(job.id, { [col.key]: val })}
                      options={col.type === 'status' ? statusOptions : col.type === 'priority' ? priorityOptions : platformOptions}
                    />
                  ) : col.type === 'link' ? (
                    <EditableCell type="link" value={job[col.key]} onSave={val => updateJob(job.id, { link: val })} />
                  ) : (
                    <EditableCell
                      type={col.type === 'salary' ? 'text' : col.type}
                      value={job[col.key]}
                      onSave={val => updateJob(job.id, { [col.key]: val })}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TrackerAddRow addJob={addJob} />
        </TableBody>
      </Table>
      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        items={menuItems}
        onClose={() => setContextMenu({ visible: false, x: 0, y: 0, jobId: null })}
      />
    </div>
  );
}
