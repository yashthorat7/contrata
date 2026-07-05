import React from 'react';
import { Textarea } from '../ui/Input';

export function OutreachAIWorkspace({ pasteValue, handlePasteResponse }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-serif text-xl text-neutral-900">AI Generation Workspace</h3>
        <p className="mt-0.5 text-sm text-neutral-400">
          Paste raw AI responses below to split sections, referencing the copied template context.
        </p>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-neutral-500">Paste Response</label>
        <Textarea
          value={pasteValue}
          onChange={handlePasteResponse}
          placeholder="Paste AI response here..."
          className="min-h-[144px] w-full"
        />
      </div>
    </div>
  );
}
