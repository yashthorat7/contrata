import { useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function usePreferences() {
  const [searchConfig, setSearchConfig] = useLocalStorage('hf_searchConfig', {
    jobType: '',
    experienceLevel: '',
    targetWebsites: '',
    location: '',
    salary: '',
    publishedAge: '',
    listingsLimit: '',
    customNotes: ''
  });

  const [links, setLinks] = useLocalStorage('hf_links', []);

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
