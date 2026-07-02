import React, { useState } from 'react';
import { Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { generateContextPrompt } from '../../utils/prompts';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function ContextStep() {
  const [contextText, setContextText] = useLocalStorage('hf_contextText', '');
  const [copied, setCopied] = useState(false);

  const handleCopyTemplate = () => {
    const finalPrompt = generateContextPrompt(contextText);
    navigator.clipboard.writeText(finalPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <Textarea
        value={contextText}
        onChange={e => setContextText(e.target.value)}
        className="min-h-[160px] text-sm leading-relaxed"
        placeholder={`e.g.,\nName: Jane Doe\nTitle: Full Stack Developer\nProjects: Scalable analytics dashboard using React & Python\nSkills: React, Node.js, AWS, Postgres\nAchievements: Reduced load times by 40%...`}
      />
      <div className="mt-3 flex justify-end">
        <Button variant="link" size="sm" onClick={handleCopyTemplate}>
          {copied ? 'Copied!' : 'Copy prompt'}
        </Button>
      </div>
    </div>
  );
}
