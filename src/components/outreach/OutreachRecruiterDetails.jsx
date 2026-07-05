import React from 'react';
import { Input } from '../ui/Input';

export function OutreachRecruiterDetails({ selectedJob, updateJobRecruiter }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-serif text-xl text-neutral-900">Recruiter Details</h3>
        <p className="mt-0.5 text-sm text-neutral-400">Configure direct email contact information for this lead.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Name</label>
          <Input
            type="text"
            value={selectedJob.recruiter?.name || ''}
            onChange={e => updateJobRecruiter(selectedJob.id, { name: e.target.value })}
            placeholder="Hiring Manager Name"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Email</label>
          <Input
            type="email"
            value={selectedJob.recruiter?.email || ''}
            onChange={e => updateJobRecruiter(selectedJob.id, { email: e.target.value })}
            placeholder="recruiter@company.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">LinkedIn Profile</label>
          <Input
            type="text"
            value={selectedJob.recruiter?.linkedin || ''}
            onChange={e => updateJobRecruiter(selectedJob.id, { linkedin: e.target.value })}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
      </div>
    </div>
  );
}
