import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { statusOptions as defaultStatusOptions, platformOptions as defaultPlatformOptions } from '../data/trackerConfig';

export function useTrackerOptions() {
  const [statusOptions, setStatusState] = useState(() => storage.get('hf_status_options', defaultStatusOptions));
  const [platformOptions, setPlatformState] = useState(() => storage.get('hf_platform_options', defaultPlatformOptions));

  useEffect(() => {
    const handleUpdate = () => {
      setStatusState(storage.get('hf_status_options', defaultStatusOptions));
      setPlatformState(storage.get('hf_platform_options', defaultPlatformOptions));
    };
    window.addEventListener('hf_options_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('hf_options_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const setStatusOptions = newOptions => {
    storage.set('hf_status_options', newOptions);
    setStatusState(newOptions);
    window.dispatchEvent(new Event('hf_options_updated'));
  };

  const setPlatformOptions = newOptions => {
    storage.set('hf_platform_options', newOptions);
    setPlatformState(newOptions);
    window.dispatchEvent(new Event('hf_options_updated'));
  };

  return {
    statusOptions,
    platformOptions,
    setStatusOptions,
    setPlatformOptions
  };
}
