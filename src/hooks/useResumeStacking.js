import { useState, useEffect, useRef } from 'react';

const A4_W = 794;
const GAP = 12;
const LHS_MAX = 5 / 9;
const LHS_MIN = 0.4;

export function useResumeStacking() {
  const containerRef = useRef(null);
  const [shouldStack, setShouldStack] = useState(false);
  const [lhsPercent, setLhsPercent] = useState(LHS_MAX * 100);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let frameId;
    const check = () => {
      const w = el.clientWidth;
      const lhs = Math.max(LHS_MIN, Math.min(LHS_MAX, (w - GAP - A4_W) / w));
      const stack = w < 1024 || lhs <= LHS_MIN;
      setShouldStack(p => (p !== stack ? stack : p));
      if (!stack) {
        const pct = Math.round(lhs * 1000) / 10;
        setLhsPercent(p => (p !== pct ? pct : p));
      }
    };

    check();
    const ro = new ResizeObserver(() => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(check);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return { containerRef, shouldStack, lhsPercent };
}
