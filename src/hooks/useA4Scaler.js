import { useEffect, useRef, useCallback } from 'react';

const W = 794;
const H = 1123;

export function useA4Scaler(deps = []) {
  const wrapperRef = useRef(null);
  const sheetRef = useRef(null);

  const resize = useCallback(() => {
    const wrapper = wrapperRef.current;
    const sheet = sheetRef.current;
    const parent = wrapper?.parentElement;
    if (!wrapper || !sheet || !parent) return;

    const scale = parent.clientWidth / W;
    sheet.style.transformOrigin = 'top left';
    sheet.style.transform = `scale(${scale})`;
    // wrapper must match the *scaled* footprint so layout doesn't see the raw 794px
    wrapper.style.width = `${parent.clientWidth}px`;
    wrapper.style.height = `${H * scale}px`;
    wrapper.style.overflow = 'hidden';
  }, []);

  useEffect(() => {
    resize();
    const parent = wrapperRef.current?.parentElement;
    if (!parent) return;
    let frameId;
    const ro = new ResizeObserver(() => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(resize);
    });
    ro.observe(parent);
    return () => {
      ro.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resize, ...deps]);

  return { wrapperRef, sheetRef, resize };
}
