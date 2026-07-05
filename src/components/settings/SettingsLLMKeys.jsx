import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Tabs } from '../ui/Tabs';
import { storage } from '../../utils/storage';

export default function SettingsLLMKeys() {
  const [activeTab, setActiveTab] = useState(() => storage.get('hf_api_provider', 'gemini'));
  const [geminiKey, setGeminiKey] = useState(() => storage.get('hf_gemini_api_key', ''));
  const [groqKey, setGroqKey] = useState(() => storage.get('hf_groq_api_key', ''));
  const [applied, setApplied] = useState(false);

  const handleApply = e => {
    e.preventDefault();
    storage.set('hf_api_provider', activeTab);
    storage.set('hf_gemini_api_key', geminiKey);
    storage.set('hf_groq_api_key', groqKey);
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  const handleTabChange = tabId => {
    setActiveTab(tabId);
    storage.set('hf_api_provider', tabId);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>LLM API Settings</CardTitle>
          <CardDescription>Configure API keys for resume tailoring.</CardDescription>
        </div>
        <Tabs
          tabs={[
            { id: 'gemini', label: 'Gemini' },
            { id: 'groq', label: 'Groq' }
          ]}
          activeId={activeTab}
          onChange={handleTabChange}
        />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleApply} className="flex max-w-md gap-2">
          {activeTab === 'gemini' ? (
            <Input
              type="password"
              value={geminiKey}
              onChange={e => setGeminiKey(e.target.value)}
              placeholder="Enter Gemini API key..."
              className="flex-1"
            />
          ) : (
            <Input
              type="password"
              value={groqKey}
              onChange={e => setGroqKey(e.target.value)}
              placeholder="Enter Groq API key..."
              className="flex-1"
            />
          )}
          <Button type="submit" variant="primary" size="default">
            {applied ? 'Applied!' : 'Apply'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
