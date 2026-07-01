import React, { useState } from 'react';
import { RemovableListItem } from '../ui/ListItem';
import { parseUrlsFromText } from '../../utils/links';

export function SmartLinkStore({ links = [], onChange }) {
  const [inputValue, setInputValue] = useState('');

  const parseAndAddLinks = text => {
    const newLinks = parseUrlsFromText(text, links);
    if (newLinks) {
      if (onChange) onChange(newLinks);
      return true;
    }
    return false;
  };

  const handlePaste = e => {
    const paste = e.clipboardData.getData('text');
    if (parseAndAddLinks(paste)) {
      e.preventDefault();
      // discard text
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (parseAndAddLinks(inputValue)) {
        e.preventDefault();
        setInputValue('');
      }
    }
  };

  const removeLink = linkToRemove => {
    if (onChange) {
      onChange(links.filter(l => l !== linkToRemove));
    }
  };

  return (
    <div className="flex h-[160px] w-full flex-col overflow-hidden rounded-md border border-neutral-300 bg-white text-sm text-neutral-800 shadow-none transition-colors focus-within:border-neutral-400 focus-within:ring-0 focus-within:outline-none">
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        placeholder={links.length === 0 ? 'Paste job links here (e.g., LinkedIn, Indeed)...' : ''}
        className="w-full flex-shrink-0 border-none bg-transparent px-2.5 pt-1.5 text-sm text-neutral-700 outline-none placeholder:text-neutral-300"
      />
      <div className="flex w-full flex-1 flex-col overflow-y-auto">
        {links.map((link, idx) => (
          <RemovableListItem key={idx} text={link} onRemove={() => removeLink(link)} />
        ))}
      </div>
    </div>
  );
}
