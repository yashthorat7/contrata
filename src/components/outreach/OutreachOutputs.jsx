import React from 'react';
import { Tabs } from '../ui/Tabs';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';

const CopyableField = ({ label, value, onChange, onCopy, copied, fieldId, placeholder, minHeight, btnLabel }) => (
  <div>
    <div className="mb-1 flex items-center justify-between">
      <label className="block text-xs font-medium text-neutral-500">{label}</label>
      {value && (
        <Button variant="link" size="sm" onClick={() => onCopy(value, fieldId)}>
          {copied === fieldId ? 'Copied' : btnLabel}
        </Button>
      )}
    </div>
    {minHeight ? (
      <Textarea value={value} onChange={onChange} placeholder={placeholder} className={minHeight} />
    ) : (
      <Input type="text" value={value} onChange={onChange} placeholder={placeholder} />
    )}
  </div>
);

export function OutreachOutputs({ selectedJob, updateJobRecruiter, updateJobOutreach, handleCopy, copiedField, activeTab, setActiveTab }) {
  const outreach = selectedJob.outreach || {};
  const jId = selectedJob.id;

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-serif text-xl text-neutral-900">Outreach Outputs</h3>
          <p className="mt-0.5 text-sm text-neutral-400">Review, copy, or send generated text sections.</p>
        </div>
        <Tabs
          tabs={[
            { id: 'email', label: 'Cold Email' },
            { id: 'cover', label: 'Cover Letter' },
            { id: 'linkedin', label: 'LinkedIn Message' }
          ]}
          activeId={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <div className="pt-2">
        {activeTab === 'email' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-neutral-500">To Email Address</label>
                <Input
                  type="email"
                  value={selectedJob.recruiter?.email || ''}
                  onChange={e => updateJobRecruiter(jId, { email: e.target.value })}
                  placeholder="recruiter@company.com"
                />
              </div>
              {selectedJob.recruiter?.email && (
                <div className="self-end pb-0.5">
                  <a
                    href={`mailto:${selectedJob.recruiter.email}?subject=${encodeURIComponent(outreach.coldEmailSubject || '')}&body=${encodeURIComponent(outreach.coldEmailBody || '')}`}
                    className="inline-flex h-8 cursor-pointer items-center justify-center rounded-md bg-neutral-800 px-3 text-sm font-medium text-white select-none hover:bg-neutral-700">
                    Send Email
                  </a>
                </div>
              )}
            </div>

            <CopyableField
              label="Subject Line"
              value={outreach.coldEmailSubject || ''}
              onChange={e => updateJobOutreach(jId, { coldEmailSubject: e.target.value })}
              onCopy={handleCopy}
              copied={copiedField}
              fieldId="subject"
              placeholder="Subject Line"
              btnLabel="Copy"
            />

            <CopyableField
              label="Email Body"
              value={outreach.coldEmailBody || ''}
              onChange={e => updateJobOutreach(jId, { coldEmailBody: e.target.value })}
              onCopy={handleCopy}
              copied={copiedField}
              fieldId="emailBody"
              placeholder="Email Body"
              minHeight="min-h-[220px]"
              btnLabel="Copy Body"
            />
          </div>
        )}

        {activeTab === 'cover' && (
          <CopyableField
            label="Cover Letter"
            value={outreach.coverLetter || ''}
            onChange={e => updateJobOutreach(jId, { coverLetter: e.target.value })}
            onCopy={handleCopy}
            copied={copiedField}
            fieldId="coverLetter"
            placeholder="Cover Letter Content"
            minHeight="min-h-[300px]"
            btnLabel="Copy Letter"
          />
        )}

        {activeTab === 'linkedin' && (
          <CopyableField
            label="LinkedIn Note/Message"
            value={outreach.linkedinMessage || ''}
            onChange={e => updateJobOutreach(jId, { linkedinMessage: e.target.value })}
            onCopy={handleCopy}
            copied={copiedField}
            fieldId="linkedin"
            placeholder="LinkedIn Message"
            minHeight="min-h-[160px]"
            btnLabel="Copy Message"
          />
        )}
      </div>
    </div>
  );
}
