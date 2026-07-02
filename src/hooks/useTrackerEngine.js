import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_JOBS } from '../data/mockJobs';

export default function useTrackerEngine() {
  const [jobs, setJobs] = useLocalStorage('job_hunter_jobs', DEFAULT_JOBS);
  const [searchQuery, setSearchQuery] = useLocalStorage('job_hunter_search', '');
  const [statusFilter, setStatusFilter] = useLocalStorage('job_hunter_status', 'All');
  const [locationTypeFilter, setLocationTypeFilter] = useLocalStorage('job_hunter_location', 'All');

  const addJob = job => {
    setJobs(prev => [{ ...job, id: Date.now().toString() }, ...prev]);
  };

  const updateJob = (id, updates) => {
    setJobs(prev => prev.map(j => (j.id === id ? { ...j, ...updates } : j)));
  };

  const updateJobsBulk = (ids, updates) => {
    setJobs(prev => prev.map(j => (ids.includes(j.id) ? { ...j, ...updates } : j)));
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
    return (jobs || []).filter(job => {
      const matchSearch =
        (job.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.role || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'All' || job.status === statusFilter;
      const matchLocation = locationTypeFilter === 'All' || job.locationType === locationTypeFilter;
      return matchSearch && matchStatus && matchLocation;
    });
  }, [jobs, searchQuery, statusFilter, locationTypeFilter]);

  return {
    jobs,
    addJob,
    updateJob,
    updateJobsBulk,
    moveJob,
    deleteJobsBulk,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    locationTypeFilter,
    setLocationTypeFilter,
    filteredJobs
  };
}
