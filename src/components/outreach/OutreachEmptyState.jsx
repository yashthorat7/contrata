import React from 'react';
import { Building } from '../ui/Icons';

export function OutreachEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-neutral-300 bg-white p-16 text-center">
      <Building className="mb-3 h-10 w-10 text-neutral-400" />
      <h3 className="font-serif text-lg text-neutral-700">No Lead Selected</h3>
      <p className="mt-1 max-w-xs text-xs text-neutral-400">
        Choose an outreach lead from the header select dropdown or upload a CSV file of contacts.
      </p>
    </div>
  );
}
