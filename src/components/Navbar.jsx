import { Link, useLocation } from 'react-router-dom';
import { Tabs } from './ui/Tabs';
import navTabs from '../data/navigation.json';

export function Navbar() {
  const location = useLocation();
  return (
    <header className="relative z-50 w-full shrink-0 bg-transparent">
      <div className="mx-auto flex h-16 w-full max-w-4xl items-center">
        <div className="flex w-1/3 justify-start">
          <Link to="/" className="font-serif text-xl font-bold text-neutral-900">
            HF.
          </Link>
        </div>

        <div className="flex w-1/3 justify-center">
          <Tabs tabs={navTabs} activeId={location.pathname} variant="floating" />
        </div>

        <div className="w-1/3 justify-end"></div>
      </div>
    </header>
  );
}
