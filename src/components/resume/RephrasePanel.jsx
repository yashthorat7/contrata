import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { generateResumePrompt } from '../../utils/prompts';
import { storage } from '../../utils/storage';

export default function RephrasePanel({ onApply, onClose }) {
  const panelRef = useRef(null);
  const [response, setResponse] = useState('');
  const [contextText] = useLocalStorage('hf_contextText', '');
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  const isEmpty = !response.trim();

  useEffect(() => {
    const staged = storage.get('hf_resume_jd', '');
    if (staged) {
      setResponse(staged);
      storage.remove('hf_resume_jd');
    }
  }, []);

  useEffect(() => {
    const handler = e => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const buildPrompt = () => generateResumePrompt(contextText, response);

  const copyPrompt = () => {
    if (isEmpty) return;
    navigator.clipboard.writeText(buildPrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (isEmpty) return;
    onApply(response.trim());
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      onClose();
    }, 1200);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      copyPrompt();
    }
  };

  return (
    <div
      ref={panelRef}
      className="absolute top-full left-0 z-50 mt-1 flex w-[420px] flex-col rounded-md border border-neutral-300 bg-white p-1.5">
      <Textarea
        variant="ghost"
        value={response}
        onChange={e => setResponse(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter job description here… (Enter to copy prompt)"
        className="h-[160px]"
      />
      <div className="mt-1 flex justify-end gap-2 px-1 pb-0.5">
        <Button variant="outline" size="sm" onClick={copyPrompt} disabled={isEmpty}>
          {copied ? 'Copied!' : 'Copy Prompt'}
        </Button>
        <Button variant="primary" size="sm" onClick={handleApply} disabled={isEmpty}>
          {applied ? 'Applied!' : 'Use AI'}
        </Button>
      </div>
    </div>
  );
}
