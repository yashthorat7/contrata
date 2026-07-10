import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatRelativeTime } from '../../utils/formatters';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ContextMenu } from '../ui/ContextMenu';
import { BookmarkIcon, ArchiveBoxIcon } from '@heroicons/react/16/solid';
import { storage } from '../../utils/storage';

const TAG_SCROLL_PX_PER_SEC = 30;

export default function TrackerCards({ updateJob, filteredJobs, selectedDetailsJobId, setSelectedDetailsJobId }) {
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, jobId: null });
  const navigate = useNavigate();

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
    } else if (action === 'Make Resume') {
      const job = filteredJobs.find(j => j.id === jobId);
      if (!job) return;
      const jd = [
        job.role && `Role: ${job.role}`,
        job.company && `Company: ${job.company}`,
        job.location && `Location: ${job.location}${job.locationType ? ` (${job.locationType})` : ''}`,
        job.salary && `Salary: ${job.salary}`,
        job.description && `\n${job.description}`
      ]
        .filter(Boolean)
        .join('\n');
      storage.set('hf_resume_jd', jd);
      navigate('/resume');
    }
  };

  const menuItems = (() => {
    const targetJob = filteredJobs.find(j => j.id === contextMenu.jobId);
    if (!targetJob) return [];

    return [
      { label: 'View Details', onClick: () => handleContextMenuAction('View Details', contextMenu.jobId) },
      { label: 'Make Resume', onClick: () => handleContextMenuAction('Make Resume', contextMenu.jobId) },
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
            <TagCard
              key={job.id}
              job={job}
              tags={tags}
              matchScore={matchScore}
              isSelected={selectedDetailsJobId === job.id}
              onSelect={() => setSelectedDetailsJobId(job.id)}
              onContextMenu={e => handleContextMenu(e, job)}
            />
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

function TagCard({ job, tags, matchScore, isSelected, onSelect, onContextMenu }) {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const [tagDuration, setTagDuration] = useState(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const measure = () => {
      const overflow = content.scrollWidth - wrapper.clientWidth;
      if (overflow > 0) {
        setTagDuration(`${overflow / TAG_SCROLL_PX_PER_SEC}s`);
      } else {
        setTagDuration(null);
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [tags]);

  return (
    <div onClick={onSelect} className="cursor-pointer">
      <Card
        className={`group relative flex min-h-[130px] flex-col rounded-lg border border-neutral-300 bg-transparent p-3.5 transition-colors hover:border-neutral-900 ${isSelected ? 'bg-neutral-50/50' : ''}`}
        onContextMenu={onContextMenu}>
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
          <div ref={wrapperRef} className="flex w-full overflow-hidden" style={{ containerType: 'inline-size' }}>
            <div
              ref={contentRef}
              className={tagDuration ? 'slide-tags-content' : ''}
              style={
                tagDuration
                  ? {
                      animationDuration: tagDuration,
                      display: 'flex',
                      width: 'max-content',
                      flexWrap: 'nowrap',
                      alignItems: 'center',
                      gap: '0.375rem'
                    }
                  : { display: 'flex', width: 'max-content', flexWrap: 'nowrap', alignItems: 'center', gap: '0.375rem' }
              }>
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
}
