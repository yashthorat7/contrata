import React, { useEffect, useRef } from 'react';
import { useA4Scaler } from '../../hooks/useA4Scaler';
import { parseResumeMarkdown } from '../../utils/resumeParser';
import { autoAdjustSpacing } from '../../utils/autoAdjustSpacing';
import { ResumeHeader, ResumeSectionsList } from './ResumeSections';

export default function ResumePreview({ markdownContent }) {
  const { wrapperRef, sheetRef, resize } = useA4Scaler([markdownContent]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) autoAdjustSpacing(containerRef.current);
    if (resize) resize();
  }, [markdownContent, resize]);

  const resume = parseResumeMarkdown(markdownContent);

  return (
    <div ref={wrapperRef} id="resume-preview-wrapper" className="relative shrink-0">
      <div ref={sheetRef} id="resume-preview-sheet" className="page-sheet absolute top-0 left-0 shrink-0 select-text">
        <div ref={containerRef} id="resume-container" className="page-content select-text">
          {resume.name && <ResumeHeader name={resume.name} contact={resume.contact} />}
          <ResumeSectionsList sections={resume.sections} />
        </div>
      </div>
    </div>
  );
}
