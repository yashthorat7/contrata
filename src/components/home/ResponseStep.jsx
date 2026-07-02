'use client';
import React, { useState } from 'react';
import { Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { storage } from '../../utils/storage';

export default function ResponseStep() {
  const [responseText, setResponseText] = useLocalStorage('hf_responseText', '');
  const [status, setStatus] = useState('idle');

  const handleImport = () => {
    if (!responseText.trim()) return;
    setStatus('loading');

    setTimeout(() => {
      try {
        const parsed = JSON.parse(responseText);
        if (Array.isArray(parsed)) {
          const existing = storage.get('job_hunter_jobs', []);
          const existingIds = new Set(existing.map(j => j.id));
          const newJobs = parsed
            .map((item, i) => ({
              id: item.id || `imported_${Date.now()}_${i}`,
              company: item.company || item.companyName || '',
              role: item.role || item.title || item.jobTitle || '',
              location: item.location || '',
              locationType: item.locationType || item.workplaceType || 'Onsite',
              salary: item.salary || item.salaryRange || '',
              status: 'Not Started',
              priority: 'Medium',
              platform: item.platform || item.source || 'Other',
              dateScraped: item.dateScraped || new Date().toISOString(),
              datePosted: item.datePosted || item.postedAt || null,
              notes: item.notes || '',
              postingLink: item.postingLink || item.url || item.link || '',
              applyLink: item.applyLink || item.applicationUrl || '',
              saved: false,
              archived: false,
              matchScore: item.matchScore || null,
              unmatchedThings: item.unmatchedThings || [],
              tags: item.tags || item.skills || [],
              recruiter: item.recruiter || { name: null, email: null, linkedin: null },
              description: item.description || item.jobDescription || item.body || ''
            }))
            .filter(j => !existingIds.has(j.id));

          storage.set('job_hunter_jobs', [...newJobs, ...existing]);
          setStatus('success');
          setResponseText('');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
      setTimeout(() => setStatus('idle'), 2500);
    }, 1200);
  };

  const getButtonText = () => {
    if (status === 'loading') return 'Importing';
    if (status === 'success') return 'Imported successfully!';
    if (status === 'error') return 'Got error (Invalid format)';
    return 'Import the data';
  };

  const getButtonVariant = () => (status === 'error' ? 'outline' : 'primary');

  return (
    <div>
      <Textarea
        value={responseText}
        onChange={e => setResponseText(e.target.value)}
        className="min-h-[160px] text-sm leading-relaxed"
        placeholder="Paste the scraped job response data (JSON array) here..."
        disabled={status === 'loading'}
      />
      <div className="mt-3 flex items-center justify-start">
        <Button
          variant={getButtonVariant()}
          onClick={handleImport}
          isLoading={status === 'loading'}
          disabled={status === 'loading' || !responseText.trim()}
          className="">
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
}
