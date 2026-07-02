import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_JOBS } from '../data/mockJobs';
import { parseSalaryToNumber } from '../utils/salary';

const DEFAULT_FILTERS = {
  sort: '',
  status: [],
  priority: [],
  platform: [],
  locationType: [],
  salaryMin: 0,
  salaryMax: 0
};

function sortJobs(jobs, sortKey) {
  if (!sortKey) return jobs;
  const [field, dir] = sortKey.split('_');
  return [...jobs].sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];
    if (field === 'datePosted' || field === 'dateScraped' || field === 'updatedAt') {
      aVal = aVal ? new Date(aVal).getTime() : 0;
      bVal = bVal ? new Date(bVal).getTime() : 0;
    } else if (field === 'matchScore') {
      aVal = aVal ?? 0;
      bVal = bVal ?? 0;
    } else {
      aVal = (aVal || '').toLowerCase();
      bVal = (bVal || '').toLowerCase();
    }
    if (aVal < bVal) return dir === 'asc' ? -1 : 1;
    if (aVal > bVal) return dir === 'asc' ? 1 : -1;
    return 0;
  });
}

export default function useTrackerEngine() {
  const [jobs, setJobs] = useLocalStorage('job_hunter_jobs', DEFAULT_JOBS);
  const [searchQuery, setSearchQuery] = useLocalStorage('job_hunter_search', '');
  const [filters, setFilters] = useLocalStorage('job_hunter_filters', DEFAULT_FILTERS);

  const addJob = job => {
    setJobs(prev => [{ ...job, id: Date.now().toString(), updatedAt: new Date().toISOString() }, ...prev]);
  };

  const updateJob = (id, updates) => {
    setJobs(prev => prev.map(j => (j.id === id ? { ...j, ...updates, updatedAt: new Date().toISOString() } : j)));
  };

  const updateJobsBulk = (ids, updates) => {
    const now = new Date().toISOString();
    setJobs(prev => prev.map(j => (ids.includes(j.id) ? { ...j, ...updates, updatedAt: now } : j)));
  };

  const moveJob = (fromIdx, toIdx) => {
    const newJobs = [...jobs];
    const [moved] = newJobs.splice(fromIdx, 1);
    newJobs.splice(toIdx, 0, moved);
    setJobs(newJobs);
  };

  const deleteJobsBulk = ids => {
    setJobs(prev => prev.filter(j => !ids.includes(j.id)));
  };

  const filteredJobs = useMemo(() => {
    let result = (jobs || []).filter(job => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || (job.company || '').toLowerCase().includes(q) || (job.role || '').toLowerCase().includes(q);

      const matchStatus = filters.status.length === 0 || filters.status.includes(job.status);
      const matchPriority = filters.priority.length === 0 || filters.priority.includes(job.priority);
      const matchPlatform = filters.platform.length === 0 || filters.platform.includes(job.platform);
      const matchLocType = filters.locationType.length === 0 || filters.locationType.includes(job.locationType);

      let matchSalary = true;
      if (filters.salaryMin > 0 || filters.salaryMax > 0) {
        const avg = parseSalaryToNumber(job.salary);
        if (avg !== null) {
          if (filters.salaryMin > 0 && avg < filters.salaryMin) matchSalary = false;
          if (filters.salaryMax > 0 && avg > filters.salaryMax) matchSalary = false;
        }
      }

      return matchSearch && matchStatus && matchPriority && matchPlatform && matchLocType && matchSalary;
    });

    return sortJobs(result, filters.sort);
  }, [jobs, searchQuery, filters]);

  const activeFilterCount = useMemo(() => {
    return [
      filters.sort !== '',
      filters.status.length > 0,
      filters.priority.length > 0,
      filters.platform.length > 0,
      filters.locationType.length > 0,
      filters.salaryMin > 0 || filters.salaryMax > 0
    ].filter(Boolean).length;
  }, [filters]);

  return {
    jobs,
    addJob,
    updateJob,
    updateJobsBulk,
    moveJob,
    deleteJobsBulk,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    filteredJobs,
    activeFilterCount
  };
}
