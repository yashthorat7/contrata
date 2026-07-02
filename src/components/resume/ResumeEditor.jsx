import React, { useRef, useEffect } from 'react';

export default function ResumeEditor({ value, onChange }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleTab = e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const newValue = value.slice(0, selectionStart) + '  ' + value.slice(selectionEnd);
      onChange(newValue);
      requestAnimationFrame(() => {
        e.target.selectionStart = selectionStart + 2;
        e.target.selectionEnd = selectionStart + 2;
      });
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleTab}
          spellCheck={false}
          className="h-full min-h-full w-full resize-none bg-transparent font-mono text-sm leading-relaxed text-neutral-800 outline-none placeholder:text-neutral-400"
          placeholder="Write your resume in Markdown..."
        />
      </div>
    </div>
  );
}
