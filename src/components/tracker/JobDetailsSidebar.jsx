import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { BadgeDropdown } from '../ui/BadgeDropdown';
import ReactMarkdown from 'react-markdown';
import { statusOptions, priorityOptions } from '../../data/trackerConfig';
import { CurrencyDollarIcon, ChartBarIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export default function JobDetailsSidebar({ job, onClose, onUpdateJob }) {
  if (!job) return null;

  const handleFieldUpdate = (field, value) => {
    onUpdateJob?.(job.id, { [field]: value });
  };

  return (
    <div className="flex h-[85vh] w-full shrink-0 flex-col gap-4 overflow-y-auto border-t border-neutral-300 bg-white p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:h-full md:w-full md:rounded-none md:border-none md:p-6 md:shadow-none">
      <div className="flex w-full items-center gap-2">
        {job.postingLink && (
          <a href={job.postingLink} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Post
            </Button>
          </a>
        )}
        {job.applyLink ? (
          <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="primary" size="sm" className="w-full">
              Apply Now
            </Button>
          </a>
        ) : (
          <Button variant="outline" size="sm" disabled className="flex-1">
            No Apply Link
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0">
          ✕
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="font-serif text-3xl font-medium text-neutral-900">{job.role || '—'}</h2>
        <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
          <span className="text-base font-medium text-neutral-700">{job.company || '—'}</span>
          <span>•</span>
          <span>{job.location || '—'}</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <BadgeDropdown current={job.status || 'Not Started'} options={statusOptions} onSave={val => handleFieldUpdate('status', val)} />
          <BadgeDropdown current={job.priority || 'Medium'} options={priorityOptions} onSave={val => handleFieldUpdate('priority', val)} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-medium tracking-wider text-neutral-400 uppercase">At a Glance</h3>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-500">
              <CurrencyDollarIcon className="h-4 w-4" />
              <span>Salary</span>
            </div>
            <span className="font-medium text-neutral-900">{job.salary || '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-500">
              <ChartBarIcon className="h-4 w-4" />
              <span>Match Score</span>
            </div>
            <span className="font-medium text-neutral-900">{job.matchScore ? `${job.matchScore}%` : '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-500">
              <GlobeAltIcon className="h-4 w-4" />
              <span>Platform</span>
            </div>
            <span className="font-medium text-neutral-900">{job.platform || '—'}</span>
          </div>
        </div>
      </div>

      {job.description && (
        <div className="flex flex-col gap-2">
          <h3 className="mb-1 text-xs font-medium tracking-wider text-neutral-400 uppercase">Job Description</h3>
          <div className="text-sm text-neutral-600">
            <ReactMarkdown
              components={{
                h1: ({ node: _, ...props }) => <h1 className="mt-4 mb-2 text-lg font-semibold text-neutral-900" {...props} />,
                h2: ({ node: _, ...props }) => <h2 className="mt-4 mb-2 text-base font-semibold text-neutral-900" {...props} />,
                h3: ({ node: _, ...props }) => <h3 className="mt-4 mb-2 text-sm font-semibold text-neutral-900" {...props} />,
                p: ({ node: _, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
                ul: ({ node: _, ...props }) => <ul className="mb-3 list-disc space-y-1 pl-5" {...props} />,
                ol: ({ node: _, ...props }) => <ol className="mb-3 list-decimal space-y-1 pl-5" {...props} />,
                li: ({ node: _, ...props }) => <li className="pl-1" {...props} />,
                strong: ({ node: _, ...props }) => <strong className="font-medium text-neutral-900" {...props} />,
                a: ({ node: _, ...props }) => <a className="text-blue-600 hover:underline" {...props} />
              }}>
              {job.description}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {job.tags && job.tags.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-medium tracking-wider text-neutral-400 uppercase">Skills & Tags</h3>
          <div className="flex flex-wrap gap-1.5">
            {job.tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="border-neutral-300 !text-sm font-normal text-neutral-600">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {job.unmatchedThings && job.unmatchedThings.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-medium tracking-wider text-neutral-400 uppercase">Missing Profile Matches</h3>
          <ul className="list-inside list-disc text-sm text-neutral-600">
            {job.unmatchedThings.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {job.recruiter && (job.recruiter.name || job.recruiter.email || job.recruiter.linkedin) && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-medium tracking-wider text-neutral-400 uppercase">Recruiter</h3>
          <div className="flex flex-col gap-1 text-sm text-neutral-600">
            {job.recruiter.name && <div>{job.recruiter.name}</div>}
            {job.recruiter.email && <div>{job.recruiter.email}</div>}
            {job.recruiter.linkedin && <div>{job.recruiter.linkedin}</div>}
          </div>
        </div>
      )}

      {job.notes && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-medium tracking-wider text-neutral-400 uppercase">Notes</h3>
          <p className="text-sm text-neutral-600">{job.notes}</p>
        </div>
      )}
    </div>
  );
}
