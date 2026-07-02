import { useEffect } from 'react';

export function useOutsideClick(refs, handler, condition = true, eventType = 'mousedown') {
  useEffect(() => {
    if (!condition) return;

    const listener = event => {
      const isOutside = refs.every(ref => ref.current && !ref.current.contains(event.target));
      if (isOutside) {
        handler(event);
      }
    };

    document.addEventListener(eventType, listener);
    return () => {
      document.removeEventListener(eventType, listener);
    };
  }, [refs, handler, condition, eventType]);
}
