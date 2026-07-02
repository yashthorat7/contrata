import React, { useState, useCallback, useEffect } from 'react';
import { useResume } from '../hooks/useResume';
import { useResumeStacking } from '../hooks/useResumeStacking';
import ResumeEditor from '../components/resume/ResumeEditor';
import ResumePreview from '../components/resume/ResumePreview';
import RephrasePanel from '../components/resume/RephrasePanel';
import { Button } from '../components/ui/Button';
import { storage } from '../utils/storage';

export default function Resume() {
  const { markdownContent, updateMarkdown, resetResume, exportPDF } = useResume();
  const { containerRef, shouldStack, lhsPercent } = useResumeStacking();
  const [showRephrase, setShowRephrase] = useState(false);

  const applyRephrase = useCallback(
    text => {
      updateMarkdown(text);
    },
    [updateMarkdown]
  );

  useEffect(() => {
    if (storage.get('hf_resume_jd', '')) setShowRephrase(true);
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden">
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden px-4 pb-4 antialiased">
        <div className="no-print mb-4 flex shrink-0 items-center justify-between">
          <div className="relative flex items-center gap-3">
            <Button variant="primary" size="sm" onClick={() => setShowRephrase(p => !p)}>
              Tailor Resume
            </Button>
            <Button variant="outline" size="sm" onClick={resetResume}>
              Reset
            </Button>
            {showRephrase && <RephrasePanel onApply={applyRephrase} onClose={() => setShowRephrase(false)} />}
          </div>
          <Button variant="outline" size="sm" onClick={exportPDF} disabled={!markdownContent.trim()}>
            Export
          </Button>
        </div>

        <div
          ref={containerRef}
          className={shouldStack ? 'flex min-h-0 flex-1 flex-col gap-3 overflow-hidden' : 'flex min-h-0 flex-1 gap-3 overflow-hidden'}>
          <div
            style={shouldStack ? undefined : { width: `${lhsPercent}%` }}
            className={`no-print rounded-md border border-neutral-300 ${
              shouldStack ? 'max-h-[35vh] min-h-[180px] flex-1' : 'min-h-0 shrink-0'
            }`}>
            <ResumeEditor value={markdownContent} onChange={updateMarkdown} />
          </div>
          <div
            className={`scrollbar-hide relative flex min-h-0 items-start justify-start overflow-auto bg-neutral-50/50 ${
              shouldStack ? 'flex-1' : 'min-w-0 flex-1'
            }`}>
            <ResumePreview markdownContent={markdownContent} />
          </div>
        </div>
      </main>
    </div>
  );
}
