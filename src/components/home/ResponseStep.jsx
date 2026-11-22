'use client';
import React, { useState } from 'react';
import { Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { storage } from '../../utils/storage';

export default function ResponseStep() {
  const [responseText, setResponseText] = useLocalStorage('hf_responseText', '');
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const handleImport = () => {
    if (!responseText.trim()) return;
    setStatus({ type: 'loading', message: '' });

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
          const successMsg =
            newJobs.length > 0
              ? `Imported ${newJobs.length} new job${newJobs.length === 1 ? '' : 's'}!`
              : 'All jobs in list are already tracked!';
          setStatus({ type: 'success', message: successMsg });
          setResponseText('');
        } else {
          setStatus({ type: 'error', message: 'Invalid format — expected a JSON array' });
        }
      } catch {
        setStatus({ type: 'error', message: 'Could not parse JSON. Check the pasted text.' });
      }
      setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
    }, 400);
  };

  const getButtonText = () => {
    if (status.type === 'loading') return 'Importing';
    if (status.type === 'success') return status.message;
    if (status.type === 'error') return status.message;
    return 'Import the data';
  };

  const getButtonVariant = () => (status.type === 'error' ? 'outline' : 'primary');

  return (
    <div>
      <Textarea
        value={responseText}
        onChange={e => setResponseText(e.target.value)}
        className="min-h-[160px] text-sm leading-relaxed"
        placeholder="Paste the scraped job response data (JSON array) here..."
        disabled={status.type === 'loading'}
      />
      <div className="mt-3 flex items-center justify-start">
        <Button
          variant={getButtonVariant()}
          onClick={handleImport}
          isLoading={status.type === 'loading'}
          disabled={status.type === 'loading' || !responseText.trim()}>
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
}
