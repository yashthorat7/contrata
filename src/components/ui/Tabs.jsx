import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Tabs({ tabs = [], activeId, defaultTab, onChange, variant = 'segmented', className = '' }) {
  const [internalActive, setInternalActive] = useState(defaultTab || (tabs.length > 0 ? tabs[0].id : ''));
  const currentActive = activeId !== undefined ? activeId : internalActive;

  const [style, setStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef(null);

  useEffect(() => {
    const updateStyle = () => {
      if (navRef.current) {
        const activeEl = navRef.current.querySelector('[data-active="true"]');
        if (activeEl) {
          setStyle({
            left: activeEl.offsetLeft,
            width: activeEl.offsetWidth,
            opacity: 1
          });
          return;
        }
      }
      setStyle(prev => ({ ...prev, opacity: 0 }));
    };

    updateStyle();

    window.addEventListener('resize', updateStyle);
    return () => window.removeEventListener('resize', updateStyle);
  }, [currentActive, tabs]);

  const handleTabClick = tabId => {
    if (activeId === undefined) setInternalActive(tabId);
    if (onChange) onChange(tabId);
  };

  if (!tabs || tabs.length === 0) return null;

  const isSegmented = variant === 'segmented';

  return (
    <nav
      ref={navRef}
      className={`relative flex w-max items-center ${
        isSegmented ? 'overflow-hidden rounded-md border border-neutral-300 bg-neutral-100/70' : 'gap-1 bg-transparent'
      } ${className}`}>
      {/* sliding highlight */}
      <div
        className={`absolute z-0 transition-all duration-300 ease-in-out ${
          isSegmented ? 'top-0 h-full rounded-none border-0 bg-white' : 'top-0 h-full rounded-md border border-neutral-300 bg-white'
        }`}
        style={{
          left: `${style.left}px`,
          width: `${style.width}px`,
          opacity: style.opacity
        }}
      />

      {tabs.map((tab, index) => {
        const isActive = currentActive === tab.id;
        const content = (
          <div className="flex items-center justify-center gap-1.5">
            {tab.icon && <tab.icon className="block h-[18px] w-[18px] sm:hidden" />}
            <span className={tab.icon ? 'hidden sm:block' : 'block'}>{tab.label}</span>
          </div>
        );

        const baseItemClass = `relative z-10 font-medium whitespace-nowrap transition-colors duration-200 select-none ${
          isActive ? 'text-neutral-900' : 'cursor-pointer text-neutral-500 hover:text-neutral-900'
        } ${isSegmented ? 'px-3 py-1 text-sm' : 'px-3 sm:px-4 py-2 sm:py-1.5 text-sm'}`;

        if (tab.href) {
          return (
            <Link key={tab.id} to={tab.href} data-active={isActive} className={baseItemClass}>
              {content}
            </Link>
          );
        }

        return (
          <React.Fragment key={tab.id}>
            <button type="button" data-active={isActive} onClick={() => handleTabClick(tab.id)} className={baseItemClass}>
              {content}
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
