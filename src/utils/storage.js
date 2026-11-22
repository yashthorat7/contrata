export const storage = {
  get: (key, defaultValue = null) => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return defaultValue;
      const parsed = JSON.parse(item);
      if (
        defaultValue !== null &&
        typeof defaultValue === 'object' &&
        !Array.isArray(defaultValue) &&
        typeof parsed === 'object' &&
        parsed !== null &&
        !Array.isArray(parsed)
      ) {
        return { ...defaultValue, ...parsed };
      }
      return parsed;
    } catch {
      return defaultValue;
    }
  },
  set: (key, value) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent('hf_storage_update', { detail: { key, value } }));
    } catch {}
  },
  remove: key => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
      window.dispatchEvent(new CustomEvent('hf_storage_update', { detail: { key, value: null } }));
    } catch {}
  }
};
