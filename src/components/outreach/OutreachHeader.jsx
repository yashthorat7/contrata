import React from 'react';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Copy, Check } from '../ui/Icons';

export function OutreachHeader({
  leadOptions,
  selectedJobId,
  setSelectedJobId,
  selectedJob,
  currentPrompt,
  handleCopy,
  copiedField,
  handleCSVUpload
}) {
  return (
    <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div className="flex-1 space-y-3">
        <label className="block text-xs font-semibold tracking-wider text-neutral-500 uppercase">Active Outreach Lead</label>
        <Select
          options={leadOptions}
          value={selectedJobId}
          onChange={setSelectedJobId}
          placeholder="Choose a Job Lead"
          className="w-full max-w-2xl"
          buttonClassName="!h-12 !text-2xl font-serif border-neutral-300 hover:border-neutral-400 bg-transparent px-3"
        />
        <p className="text-sm text-neutral-500">Configure email settings, copy prompts, paste AI responses, and manage outreach copy.</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {selectedJob && (
          <Button
            variant="outline"
            onClick={() => handleCopy(currentPrompt, 'prompt')}
            icon={copiedField === 'prompt' ? Check : Copy}
            className="!h-9 px-4 text-sm">
            {copiedField === 'prompt' ? 'Copied Prompt!' : 'Copy AI Prompt'}
          </Button>
        )}
        <label className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700 select-none hover:border-neutral-400 hover:bg-neutral-50">
          Import CSV
          <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
        </label>
      </div>
    </div>
  );
}
