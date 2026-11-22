import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => storage.get(key, initialValue));

  const setStoredValue = useCallback(
    newValue => {
      setValue(prev => {
        const resolved = typeof newValue === 'function' ? newValue(prev) : newValue;
        storage.set(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  useEffect(() => {
    const handleStorage = e => {
      if (e.key === key) {
        setValue(storage.get(key, initialValue));
      }
    };
    const handleCustom = e => {
      if (e.detail?.key === key) {
        setValue(e.detail.value ?? initialValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('hf_storage_update', handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('hf_storage_update', handleCustom);
    };
  }, [key, initialValue]);

  return [value, setStoredValue];
}
