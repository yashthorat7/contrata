import React, { useState } from 'react';
import { EditableSpan } from '../ui/EditableSpan';
import { Button, ConfirmButton } from '../ui/Button';
import { SmartLinkStore } from './SmartLinkStore';
import { usePreferences } from '../../hooks/usePreferences';
import { generateSearchPrompt, generateLinksPrompt } from '../../utils/prompts';
import { storage } from '../../utils/storage';

export default function PreferencesStep({ activeTab }) {
  const { searchConfig, updateSearchConfig, links, setLinks, refs, handleLastFieldEnter } = usePreferences();
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = () => {
    const contextText = storage.get('hf_contextText', 'No context provided.');
    const prompt = activeTab === 'search' ? generateSearchPrompt(searchConfig, contextText) : generateLinksPrompt(links, contextText);

    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetSearch = () => {
    storage.remove('hf_searchConfig');
    window.location.reload(); // reset state
  };

  return (
    <div>
      {activeTab === 'search' ? (
        <div className="flex min-h-[160px] flex-col justify-center py-4 font-sans text-sm leading-loose text-neutral-700 select-none">
          <div>
            I am looking for an{' '}
            <EditableSpan
              inputRef={refs.jobType}
              value={searchConfig.jobType}
              onChange={val => updateSearchConfig('jobType', val)}
              nextRef={refs.expLevel}
              placeholder="internship/full-time"
            />{' '}
            position focused on{' '}
            <EditableSpan
              inputRef={refs.expLevel}
              value={searchConfig.experienceLevel}
              onChange={val => updateSearchConfig('experienceLevel', val)}
              nextRef={refs.keywords}
              placeholder="entry-level/senior"
            />{' '}
            roles. I want to scrape from{' '}
            <EditableSpan
              inputRef={refs.keywords}
              value={searchConfig.targetWebsites}
              onChange={val => updateSearchConfig('targetWebsites', val)}
              nextRef={refs.location}
              placeholder="linkedin, indeed"
            />{' '}
            located in{' '}
            <EditableSpan
              inputRef={refs.location}
              value={searchConfig.location}
              onChange={val => updateSearchConfig('location', val)}
              nextRef={refs.salary}
              placeholder="city or remote"
            />{' '}
            offering a stipend/salary of at least{' '}
            <EditableSpan
              inputRef={refs.salary}
              value={searchConfig.salary}
              onChange={val => updateSearchConfig('salary', val)}
              nextRef={refs.age}
              placeholder="stipend expectation"
            />{' '}
            posted within the last{' '}
            <EditableSpan
              inputRef={refs.age}
              value={searchConfig.publishedAge}
              onChange={val => updateSearchConfig('publishedAge', val)}
              nextRef={refs.limit}
              placeholder="time window"
            />{' '}
            and limit results to{' '}
            <EditableSpan
              inputRef={refs.limit}
              value={searchConfig.listingsLimit}
              onChange={val => updateSearchConfig('listingsLimit', val)}
              nextRef={refs.notes}
              placeholder="max items"
            />{' '}
            items. Additionally, the role should focus on{' '}
            <EditableSpan
              inputRef={refs.notes}
              value={searchConfig.customNotes}
              onChange={val => updateSearchConfig('customNotes', val)}
              nextRef={null}
              placeholder="tech constraints"
            />
            .
          </div>
        </div>
      ) : (
        <SmartLinkStore links={links} onChange={setLinks} />
      )}

      <div className="mt-3 flex items-center gap-3">
        {activeTab === 'search' ? (
          <>
            <Button variant="primary" onClick={handleCopyPrompt} className="min-w-[120px]">
              {copied ? 'Copied!' : 'Copy prompt'}
            </Button>
            <ConfirmButton variant="outline" onConfirm={handleResetSearch}>
              Reset
            </ConfirmButton>
          </>
        ) : (
          <>
            <Button variant="primary" className="flex min-w-[120px] items-center justify-center gap-1.5" onClick={handleCopyPrompt}>
              {copied ? (
                'Copied!'
              ) : (
                <>
                  Copy prompt <span className="text-xs font-medium opacity-60">({links.length})</span>
                </>
              )}
            </Button>
            <ConfirmButton variant="outline" onConfirm={() => setLinks([])}>
              Reset
            </ConfirmButton>
          </>
        )}
      </div>
    </div>
  );
}
