import { useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const DEFAULT_SEARCH_CONFIG = {
  jobType: '',
  experienceLevel: '',
  targetWebsites: '',
  location: '',
  salary: '',
  publishedAge: '',
  listingsLimit: '',
  customNotes: ''
};

export function usePreferences() {
  const [searchConfig, setSearchConfig] = useLocalStorage('hf_searchConfig', DEFAULT_SEARCH_CONFIG);
  const [links, setLinks] = useLocalStorage('hf_links', []);

  const updateSearchConfig = (key, value) => {
    setSearchConfig(prev => ({ ...prev, [key]: value }));
  };

  const resetSearchConfig = () => {
    setSearchConfig(DEFAULT_SEARCH_CONFIG);
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
    resetSearchConfig,
    links,
    setLinks,
    refs,
    handleLastFieldEnter
  };
}
