import React, { useEffect } from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import ReactMarkdown from 'react-markdown';
import { CurrencyDollarIcon, ChartBarIcon, GlobeAltIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default function JobDetailsSidebar({ job, onClose }) {
  if (!job) return null;

  return (
    <div className="flex h-[85vh] w-full shrink-0 flex-col gap-6 overflow-y-auto border-t border-neutral-300 bg-white p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:h-full md:w-full md:rounded-none md:border-none md:p-8 md:shadow-none">
      <div className="flex w-full items-start justify-between">
        <div className="flex flex-col gap-1 pr-4">
          <h2 className="text-2xl font-medium text-neutral-900">{job.role || '—'}</h2>
          <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
            <span>{job.company || '—'}</span>
            <span>•</span>
            <span>{job.location || '—'}</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onClose} className="shrink-0">
          Close
        </Button>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-500">
              <InformationCircleIcon className="h-4 w-4" />
              <span>Status</span>
            </div>
            <span className="font-medium text-neutral-900">{job.status || '—'}</span>
          </div>
        </div>
      </div>

      {job.description && (
        <div className="flex flex-col gap-2">
          <h3 className="mb-1 text-xs font-medium tracking-wider text-neutral-400 uppercase">Job Description</h3>
          <div className="text-sm text-neutral-600">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 className="mt-4 mb-2 text-lg font-semibold text-neutral-900" {...props} />,
                h2: ({ node, ...props }) => <h2 className="mt-4 mb-2 text-base font-semibold text-neutral-900" {...props} />,
                h3: ({ node, ...props }) => <h3 className="mt-4 mb-2 text-sm font-semibold text-neutral-900" {...props} />,
                p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="mb-3 list-disc space-y-1 pl-5" {...props} />,
                ol: ({ node, ...props }) => <ol className="mb-3 list-decimal space-y-1 pl-5" {...props} />,
                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-medium text-neutral-900" {...props} />,
                a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />
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

      <div className="mt-auto flex w-full gap-3 pt-6 pb-2">
        {job.postingLink && (
          <a
            href={job.postingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center rounded-md border border-neutral-300 bg-transparent px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 focus:outline-none">
            View Post
          </a>
        )}
        {job.applyLink ? (
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center rounded-md border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 focus:outline-none">
            Apply Now
          </a>
        ) : (
          <div className="flex flex-1 cursor-not-allowed items-center justify-center rounded-md border border-neutral-300 bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-400">
            No Apply Link
          </div>
        )}
      </div>
    </div>
  );
}
