import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';

export function useTrackerTable({
  filteredJobs,
  selectedJobIds,
  setSelectedJobIds,
  deleteJobsBulk,
  updateJobsBulk,
  updateJob,
  setSelectedDetailsJobId
}) {
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, jobId: null });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();

  const sortedJobs = useMemo(() => {
    if (!sortConfig.key) return filteredJobs;
    return [...filteredJobs].sort((a, b) => {
      const valA = a[sortConfig.key] || '';
      const valB = b[sortConfig.key] || '';
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredJobs, sortConfig]);

  const handleSort = key => {
    if (key === '_details') return;
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleContextMenu = (e, job) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, jobId: job.id });
  };

  const handleContextMenuAction = (action, jobId) => {
    const isBulk = selectedJobIds.length > 0 && selectedJobIds.includes(jobId);
    const targetIds = isBulk ? selectedJobIds : [jobId];

    if (action === 'delete') {
      deleteJobsBulk(targetIds);
      setSelectedJobIds([]);
    } else if (action === 'save') {
      if (isBulk) {
        updateJobsBulk(targetIds, { saved: true, archived: false });
      } else {
        const job = filteredJobs.find(j => j.id === jobId);
        updateJob(jobId, { saved: !job?.saved, archived: false });
      }
      setSelectedJobIds([]);
    } else if (action === 'archive') {
      if (isBulk) {
        updateJobsBulk(targetIds, { archived: true, saved: false });
      } else {
        const job = filteredJobs.find(j => j.id === jobId);
        updateJob(jobId, { archived: !job?.archived, saved: false });
      }
      setSelectedJobIds([]);
    } else if (action === 'unmark') {
      if (isBulk) {
        updateJobsBulk(targetIds, { saved: false, archived: false });
      } else {
        updateJob(jobId, { saved: false, archived: false });
      }
      setSelectedJobIds([]);
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
    } else {
      alert(`${action} (Feature coming soon!)`);
    }
  };

  const menuItems = (() => {
    const targetJob = filteredJobs.find(j => j.id === contextMenu.jobId);
    if (!targetJob) return [];

    const isBulk = selectedJobIds.length > 0 && selectedJobIds.includes(contextMenu.jobId);

    if (isBulk) {
      return [
        { label: `Save ${selectedJobIds.length} Items`, onClick: () => handleContextMenuAction('save', contextMenu.jobId) },
        { label: `Archive ${selectedJobIds.length} Items`, onClick: () => handleContextMenuAction('archive', contextMenu.jobId) },
        { label: `Unmark ${selectedJobIds.length} Items`, onClick: () => handleContextMenuAction('unmark', contextMenu.jobId) }
      ];
    }

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

  const toggleSelectAll = () => {
    if (selectedJobIds.length === filteredJobs.length && filteredJobs.length > 0) {
      setSelectedJobIds([]);
    } else {
      setSelectedJobIds(filteredJobs.map(j => j.id));
    }
  };

  const toggleSelect = jobId => {
    setSelectedJobIds(prev => (prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]));
  };

  return {
    contextMenu,
    setContextMenu,
    sortConfig,
    sortedJobs,
    handleSort,
    handleContextMenu,
    menuItems,
    toggleSelectAll,
    toggleSelect
  };
}
