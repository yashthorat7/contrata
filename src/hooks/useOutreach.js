import { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_RESUME_MD } from '../data/defaultResume';
import { DEFAULT_JOBS } from '../data/mockJobs';
import { extractEmail } from '../utils/outreach';

export function useOutreach() {
  const [jobs, setJobs] = useLocalStorage('job_hunter_jobs', DEFAULT_JOBS);
  const [resumeMd] = useLocalStorage('hf_resume_md', DEFAULT_RESUME_MD);
  const [selectedJobId, setSelectedJobIdState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem('hf_outreach_selected_job_id');
        return stored ? JSON.parse(stored) : '';
      } catch {
        return '';
      }
    }
    return '';
  });

  const setSelectedJobId = id => {
    setSelectedJobIdState(id);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('hf_outreach_selected_job_id', JSON.stringify(id));
    }
  };

  const activeJobs = useMemo(() => {
    return jobs.filter(j => !j.archived);
  }, [jobs]);

  const selectedJob = useMemo(() => {
    if (!selectedJobId) return null;
    return jobs.find(j => j.id === selectedJobId) || null;
  }, [selectedJobId, jobs]);

  useEffect(() => {
    if (!selectedJobId && activeJobs.length > 0) {
      setSelectedJobId(activeJobs[0].id);
    }
  }, [selectedJobId, activeJobs]);

  const updateJobOutreach = (jobId, outreachData) => {
    setJobs(prev =>
      prev.map(j => {
        if (j.id === jobId) {
          return {
            ...j,
            outreach: {
              ...(j.outreach || {}),
              ...outreachData
            },
            updatedAt: new Date().toISOString()
          };
        }
        return j;
      })
    );
  };

  const updateJobRecruiter = (jobId, recruiterData) => {
    setJobs(prev =>
      prev.map(j => {
        if (j.id === jobId) {
          return {
            ...j,
            recruiter: {
              ...(j.recruiter || {}),
              ...recruiterData
            },
            updatedAt: new Date().toISOString()
          };
        }
        return j;
      })
    );
  };

  const importJobsFromCSV = (rows, mapping) => {
    const newJobs = rows
      .map((row, index) => {
        const company = row[mapping.company] || '';
        const role = row[mapping.role] || '';
        if (!company && !role) return null;

        const desc = mapping.description !== undefined ? row[mapping.description] || '' : '';
        const email = mapping.recruiterEmail !== undefined ? row[mapping.recruiterEmail] || null : null;
        const finalEmail = email || extractEmail(desc);

        return {
          id: `csv-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 8)}`,
          company: company || 'Imported Company',
          role: role || 'Imported Role',
          location: mapping.location !== undefined ? row[mapping.location] || 'Not specified' : 'Not specified',
          locationType: mapping.locationType !== undefined ? row[mapping.locationType] || 'Remote' : 'Remote',
          salary: mapping.salary !== undefined ? row[mapping.salary] || 'Not disclosed' : 'Not disclosed',
          status: 'Not Started',
          priority: 'Medium',
          platform: 'CSV Import',
          saved: true,
          archived: false,
          matchScore: 70,
          tags: ['React', 'TypeScript', 'Node.js', 'CSS'],
          dateScraped: new Date().toISOString(),
          datePosted: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          recruiter: {
            name: mapping.recruiterName !== undefined ? row[mapping.recruiterName] || null : null,
            email: finalEmail,
            linkedin: mapping.recruiterLinkedin !== undefined ? row[mapping.recruiterLinkedin] || null : null
          },
          description: desc,
          outreach: {
            coldEmailSubject: '',
            coldEmailBody: '',
            coverLetter: '',
            linkedinMessage: ''
          }
        };
      })
      .filter(Boolean);

    if (newJobs.length > 0) {
      setJobs(prev => [...newJobs, ...prev]);
      setSelectedJobId(newJobs[0].id);
    }
    return newJobs.length;
  };

  return {
    jobs: activeJobs,
    selectedJobId,
    selectedJob,
    setSelectedJobId,
    updateJobOutreach,
    updateJobRecruiter,
    importJobsFromCSV,
    resumeMd
  };
}
