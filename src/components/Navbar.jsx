import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const tabs = [
  { name: 'Home', path: '/' },
  { name: 'Tracker', path: '/tracker' },
  { name: 'Resume', path: '/resume' },
  { name: 'Outreach', path: '/outreach' },
  { name: 'Settings', path: '/settings' }
];

export function Navbar() {
  const location = useLocation();
  const [style, setStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef(null);

  useEffect(() => {
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
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-transparent">
      <div className="mx-auto flex h-16 w-full max-w-4xl items-center">
        <div className="flex w-1/3 justify-start">
          <Link to="/" className="font-serif text-lg font-bold text-neutral-900">
            HF.
          </Link>
        </div>

        <div className="flex w-1/3 justify-center">
          <nav ref={navRef} className="relative flex w-max items-center gap-1">
            {/* Sliding active highlight */}
            <div
              className="absolute z-0 h-full rounded-md border border-neutral-300 bg-white transition-all duration-300 ease-in-out"
              style={{
                left: `${style.left}px`,
                width: `${style.width}px`,
                opacity: style.opacity
              }}
            />
            {tabs.map(tab => {
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={tab.name}
                  to={tab.path}
                  data-active={isActive}
                  className={`relative z-10 px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 select-none ${
                    isActive ? 'text-neutral-900' : 'cursor-pointer text-neutral-500 hover:text-neutral-900'
                  }`}>
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="w-1/3 justify-end"></div>
      </div>
    </header>
  );
}
