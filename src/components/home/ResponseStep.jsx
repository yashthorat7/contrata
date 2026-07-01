'use client';
import React, { useState, useEffect } from 'react';
import { Textarea } from '../ui/Input';
import { Button } from '../ui/Button';

export default function ResponseStep() {
  const [responseText, setResponseText] = useState(() => {
    return localStorage.getItem('hf_responseText') || '';
  });
  const [status, setStatus] = useState('idle'); // status enum

  useEffect(() => {
    localStorage.setItem('hf_responseText', responseText);
  }, [responseText]);

  const handleImport = () => {
    if (!responseText.trim()) return;
    setStatus('loading');

    // simulate import
    setTimeout(() => {
      try {
        const parsed = JSON.parse(responseText);
        // check if array
        if (Array.isArray(parsed)) {
          console.log('Importing data...', parsed);
          setStatus('success');
          setResponseText('');
        } else {
          setStatus('error');
        }
      } catch (e) {
        setStatus('error');
      }

      // reset button
      setTimeout(() => setStatus('idle'), 2500);
    }, 1200);
  };

  const getButtonText = () => {
    if (status === 'loading') return 'Importing';
    if (status === 'success') return 'Imported successfully!';
    if (status === 'error') return 'Got error (Invalid format)';
    return 'Import the data';
  };

  const getButtonVariant = () => {
    if (status === 'error') return 'outline';
    return 'primary';
  };

  return (
    <div>
      <Textarea
        value={responseText}
        onChange={e => setResponseText(e.target.value)}
        className="min-h-[160px] text-sm leading-relaxed"
        placeholder="Paste the scraped job response data (JSON array) here..."
        disabled={status === 'loading'}
      />
      <div className="mt-3 flex items-center justify-start">
        <Button
          variant={getButtonVariant()}
          onClick={handleImport}
          isLoading={status === 'loading'}
          disabled={status === 'loading'}
          className={`${status === 'error' ? 'border-red-200 text-red-600 hover:bg-red-50' : ''}`}>
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
}
