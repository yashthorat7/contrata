import { useEffect, useRef } from 'react';

export function useOutsideClick(refs, handler, condition = true, eventType = 'mousedown') {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!condition) return;

    const listener = event => {
      const isOutside = refs.every(ref => ref.current && !ref.current.contains(event.target));
      if (isOutside) handlerRef.current(event);
    };

    document.addEventListener(eventType, listener);
    return () => document.removeEventListener(eventType, listener);
  }, [refs, condition, eventType]);
}
