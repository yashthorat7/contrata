import React, { useState } from 'react';
import { formatRelativeTime } from '../../utils/formatters';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ContextMenu } from '../ui/ContextMenu';
import { BookmarkIcon, ArchiveBoxIcon } from '@heroicons/react/16/solid';

export default function TrackerCards({
  updateJob,
  updateJobsBulk,
  filteredJobs,
  selectedJobIds,
  setSelectedJobIds,
  selectedDetailsJobId,
  setSelectedDetailsJobId
}) {
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, jobId: null });

  const handleContextMenu = (e, job) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, jobId: job.id });
  };

  const handleContextMenuAction = (action, jobId) => {
    if (action === 'save') {
      const job = filteredJobs.find(j => j.id === jobId);
      updateJob(jobId, { saved: !job.saved, archived: false });
    } else if (action === 'archive') {
      const job = filteredJobs.find(j => j.id === jobId);
      updateJob(jobId, { archived: !job.archived, saved: false });
    } else if (action === 'unmark') {
      updateJob(jobId, { saved: false, archived: false });
    } else if (action === 'View Details') {
      setSelectedDetailsJobId?.(jobId);
    } else {
      alert(`${action} (Feature coming soon!)`);
    }
  };

  const menuItems = (() => {
    const targetJob = filteredJobs.find(j => j.id === contextMenu.jobId);
    if (!targetJob) return [];

    return [
      { label: 'View Details', onClick: () => handleContextMenuAction('View Details', contextMenu.jobId) },
      { label: 'Make Resume', onClick: () => handleContextMenuAction('Make Resume', contextMenu.jobId) },
      { label: 'Make Cover Letter', onClick: () => handleContextMenuAction('Make Cover Letter', contextMenu.jobId) },
      ...(targetJob.saved
        ? [
            { label: 'Unmark', onClick: () => handleContextMenuAction('unmark', contextMenu.jobId) },
            { label: 'Archive It', onClick: () => handleContextMenuAction('archive', contextMenu.jobId) }
          ]
        : targetJob.archived
          ? [
              { label: 'Unmark', onClick: () => handleContextMenuAction('unmark', contextMenu.jobId) },
              { label: 'Save It', onClick: () => handleContextMenuAction('save', contextMenu.jobId) }
            ]
          : [
              { label: 'Save It', onClick: () => handleContextMenuAction('save', contextMenu.jobId) },
              { label: 'Archive It', onClick: () => handleContextMenuAction('archive', contextMenu.jobId) }
            ])
    ];
  })();

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-y-auto pt-2 pb-8">
      <div
        className={`grid grid-cols-1 gap-3 ${selectedDetailsJobId ? 'md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
        {filteredJobs.map(job => {
          const tags = job.tags || ['Frontend', 'React'];
          const matchScore = job.matchScore || Math.floor(Math.random() * 20 + 80);

          return (
            <div key={job.id} onClick={() => setSelectedDetailsJobId(job.id)} className="cursor-pointer">
              <Card
                className={`group relative flex min-h-[130px] flex-col rounded-lg border border-neutral-300 bg-transparent p-3.5 transition-colors hover:border-neutral-900 ${selectedDetailsJobId === job.id ? 'bg-neutral-50/50' : ''}`}
                onContextMenu={e => handleContextMenu(e, job)}>
                <div className="mb-3 flex w-full items-center justify-between overflow-hidden">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Badge
                      variant="default"
                      className="shrink-0 rounded-sm border-neutral-900 bg-neutral-900 px-2 py-0.5 !text-sm font-normal text-white">
                      {matchScore}%
                    </Badge>
                    <Badge variant="outline" className="shrink-0 border-neutral-300 !text-sm font-normal text-neutral-600">
                      {job.platform}
                    </Badge>
                    <Badge variant="outline" className="shrink-0 border-neutral-300 !text-sm font-normal text-neutral-600">
                      {job.status}
                    </Badge>
                  </div>
                  <div className="ml-2 flex shrink-0 items-center gap-1.5">
                    {job.saved ? (
                      <BookmarkIcon className="h-4 w-4 text-neutral-900" />
                    ) : job.archived ? (
                      <ArchiveBoxIcon className="h-4 w-4 text-neutral-900" />
                    ) : null}
                    <span className="!text-sm font-normal whitespace-nowrap text-neutral-500">
                      {formatRelativeTime(job.datePosted || job.date)}
                    </span>
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate !text-lg font-normal text-neutral-900">{job.role || '—'}</span>
                  <div className="flex items-center gap-2 overflow-hidden text-sm text-neutral-500">
                    <span className="truncate !text-base font-normal text-neutral-700">{job.company || '—'}</span>
                    <span className="shrink-0 text-neutral-300">•</span>
                    <span className="truncate !text-sm font-normal">{job.location || '—'}</span>
                  </div>
                </div>

                <div className="mt-4 flex w-full items-end justify-between gap-4">
                  <div className="flex w-full overflow-hidden" style={{ containerType: 'inline-size' }}>
                    <div className="slide-tags-content flex w-max flex-nowrap items-center gap-1.5">
                      {tags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="shrink-0 rounded-sm border-neutral-300 px-1.5 py-0.5 !text-sm font-normal text-neutral-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="!w-auto text-right !text-sm font-normal text-neutral-900">{job.salary || '—'}</span>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {filteredJobs.length === 0 && <div className="flex flex-1 items-center justify-center text-sm text-neutral-400">No jobs found.</div>}

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
