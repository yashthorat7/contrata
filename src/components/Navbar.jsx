import { Link, useLocation } from 'react-router-dom';
import { Tabs } from './ui/Tabs';
import navTabs from '../data/navigation.json';
import { NavHome, NavTracker, NavSettings } from './ui/Icons';

const iconMap = {
  '/': NavHome,
  '/tracker': NavTracker,
  '/settings': NavSettings
};

export function Navbar() {
  const location = useLocation();

  const enhancedTabs = navTabs.map(tab => ({
    ...tab,
    icon: iconMap[tab.id]
  }));

  return (
    <header className="relative z-50 w-full shrink-0 bg-transparent px-4 lg:px-0">
      <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between">
        <div className="flex w-auto justify-start">
          <Link to="/" className="font-serif text-xl font-bold text-neutral-900">
            Contrata
          </Link>
        </div>

        <div className="no-scrollbar ml-4 flex flex-1 justify-end overflow-x-auto sm:justify-center">
          <Tabs tabs={enhancedTabs} activeId={location.pathname} variant="floating" />
        </div>
      </div>
    </header>
  );
}
