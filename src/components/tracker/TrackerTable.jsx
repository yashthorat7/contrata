'use client';
import React from 'react';
import { formatIndianSalary } from '../../utils/formatters';
import { statusOptions, platformOptions, priorityOptions, trackerColumns as columns } from '../../data/trackerConfig';
import { EditableCell } from '../ui/EditableCell';
import { BadgeDropdown } from '../ui/BadgeDropdown';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/Table';

export default function TrackerTable({ updateJob, filteredJobs }) {
  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-2">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow>
            {columns.map(col => (
              <TableHead key={col.key} style={{ width: col.width, minWidth: col.width }} className="font-medium whitespace-nowrap">
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredJobs.map(job => (
            <TableRow key={job.id} className="bg-transparent hover:bg-neutral-50">
              {columns.map(col => (
                <TableCell key={col.key} className={col.key === 'notes' ? 'max-w-[300px] min-w-[200px] truncate' : 'whitespace-nowrap'}>
                  {['status', 'priority', 'platform'].includes(col.type) ? (
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
                      onSave={val => updateJob(job.id, { [col.key]: col.key === 'salary' ? formatIndianSalary(val) : val })}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
