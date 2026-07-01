import { useState, useRef, useEffect } from 'react';

export function usePreferences() {
  const [searchConfig, setSearchConfig] = useState(() => {
    const saved = localStorage.getItem('hf_searchConfig');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse searchConfig from localStorage');
      }
    }
    return {
      jobType: '',
      experienceLevel: '',
      targetWebsites: '',
      location: '',
      salary: '',
      publishedAge: '',
      listingsLimit: '',
      customNotes: ''
    };
  });

  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem('hf_links');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse links from localStorage');
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('hf_searchConfig', JSON.stringify(searchConfig));
  }, [searchConfig]);

  useEffect(() => {
    localStorage.setItem('hf_links', JSON.stringify(links));
  }, [links]);

  const updateSearchConfig = (key, value) => {
    const limitedValue = value.length > 30 ? value.substring(0, 30) : value;
    setSearchConfig(prev => ({ ...prev, [key]: limitedValue }));
  };

  const refs = {
    jobType: useRef(null),
    expLevel: useRef(null),
    keywords: useRef(null),
    location: useRef(null),
    salary: useRef(null),
    age: useRef(null),
    limit: useRef(null),
    notes: useRef(null)
  };

  const handleLastFieldEnter = e => {
    e.target.blur();
  };

  return {
    searchConfig,
    updateSearchConfig,
    links,
    setLinks,
    refs,
    handleLastFieldEnter
  };
}
