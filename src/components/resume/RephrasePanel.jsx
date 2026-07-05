import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { generateResumePrompt, generateSimpleEditPrompt } from '../../utils/prompts';
import { storage } from '../../utils/storage';

const GEMINI_MODEL = 'gemini-2.0-flash';

export default function RephrasePanel({ resumeMarkdown, onApply, onClose }) {
  const panelRef = useRef(null);
  const [response, setResponse] = useState('');
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');
  const [copyError, setCopyError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const showError = (setter, msg) => {
    setter(msg);
    setTimeout(() => setter(''), 2000);
  };

  const copyPrompt = () => {
    const ctx = storage.get('hf_contextText', '');
    if (!response.trim()) return showError(setCopyError, 'Missing JD');
    if (!ctx.trim()) return showError(setCopyError, 'Missing Profile Info');
    navigator.clipboard.writeText(generateResumePrompt(ctx, response, resumeMarkdown));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const callGemini = async (key, prompt) => {
    const res = await fetch(`/api-gemini/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    if (!res.ok) throw new Error(`Gemini API ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  };

  const callGroq = async (key, prompt) => {
    const res = await fetch('/api-groq/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: 'llama-3.1-70b-versatile', messages: [{ role: 'user', content: prompt }] })
    });
    if (!res.ok) throw new Error(`Groq API ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  };

  const stripFences = text =>
    text.replace(/^```markdown\s*/i, '').replace(/^```\s*/m, '').replace(/```\s*$/, '').trim();

  const handleApply = async () => {
    const provider = storage.get('hf_api_provider', 'gemini');
    const activeKey = provider === 'gemini'
      ? storage.get('hf_gemini_api_key', '')
      : storage.get('hf_groq_api_key', '');

    if (!response.trim()) return showError(setError, 'Missing Input');
    if (!activeKey?.trim()) return showError(setError, 'Missing API Key');

    setLoading(true);
    try {
      const prompt = generateSimpleEditPrompt(resumeMarkdown, response);
      const raw = provider === 'gemini'
        ? await callGemini(activeKey, prompt)
        : await callGroq(activeKey, prompt);

      if (!raw) throw new Error('No response from AI');

      onApply(stripFences(raw));
      setApplied(true);
      setTimeout(() => { setApplied(false); onClose(); }, 1200);
    } catch {
      showError(setError, 'API Error');
    } finally {
      setLoading(false);
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
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); copyPrompt(); } }}
        placeholder="Enter job description here… (Enter to copy prompt)"
        className="h-[160px]"
      />
      <div className="mt-1 flex justify-end gap-2 px-1 pb-0.5">
        <Button variant="outline" size="sm" onClick={copyPrompt}>
          {copyError || (copied ? 'Copied!' : 'Copy Prompt')}
        </Button>
        <Button variant="primary" size="sm" onClick={handleApply} disabled={loading}>
          {error || (loading ? 'Generating...' : (applied ? 'Applied!' : 'Use AI'))}
        </Button>
      </div>
    </div>
  );
}
