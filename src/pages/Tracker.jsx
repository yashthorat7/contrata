import React from 'react';
import TrackerTable from '../components/tracker/TrackerTable';
import useTrackerEngine from '../hooks/useTrackerEngine.js';

export default function Tracker() {
  const trackerEngine = useTrackerEngine();

  return (
    <main className="flex h-[calc(100vh-4rem)] w-full flex-col px-4 py-4 antialiased lg:px-6">
      <TrackerTable {...trackerEngine} />
    </main>
  );
}
