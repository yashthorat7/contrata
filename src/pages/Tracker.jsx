import React, { useState, useEffect } from 'react';
import TrackerTable from '../components/tracker/TrackerTable';
import TrackerCards from '../components/tracker/TrackerCards';
import JobDetailsSidebar from '../components/tracker/JobDetailsSidebar';
import useTrackerEngine from '../hooks/useTrackerEngine.js';
import { Tabs } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { Filter } from '../components/ui/Icons';
import { Select } from '../components/ui/Select';

export default function Tracker() {
  const trackerEngine = useTrackerEngine();
  const [viewMode, setViewMode] = useState('table');
  const [selectedJobIds, setSelectedJobIds] = useState([]);
  const [selectedDetailsJobId, setSelectedDetailsJobId] = useState(null);
  const [renderedJob, setRenderedJob] = useState(null);

  useEffect(() => {
    if (selectedDetailsJobId) {
      setRenderedJob(trackerEngine.filteredJobs.find(j => j.id === selectedDetailsJobId));
    }
  }, [selectedDetailsJobId, trackerEngine.filteredJobs]);

  const tabs = [
    { id: 'table', label: 'Table' },
    { id: 'cards', label: 'Cards' }
  ];

  const actionOptions = [
    { label: `Save ${selectedJobIds.length} Items`, value: 'save', confirm: true },
    { label: `Archive ${selectedJobIds.length} Items`, value: 'archive', confirm: true },
    { label: `Unmark ${selectedJobIds.length} Items`, value: 'unmark', confirm: true },
    { label: `Delete ${selectedJobIds.length} Items`, value: 'delete', confirm: true }
  ];

  const handleBulkAction = action => {
    if (action === 'delete') {
      trackerEngine.deleteJobsBulk(selectedJobIds);
    } else if (action === 'save') {
      trackerEngine.updateJobsBulk(selectedJobIds, { saved: true, archived: false });
    } else if (action === 'archive') {
      trackerEngine.updateJobsBulk(selectedJobIds, { archived: true, saved: false });
    } else if (action === 'unmark') {
      trackerEngine.updateJobsBulk(selectedJobIds, { saved: false, archived: false });
    }
    setSelectedJobIds([]);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden">
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto px-4 antialiased lg:px-6">
        <div className="mb-4 flex w-full shrink-0 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={Filter}>
              Filter
            </Button>
            <div className="flex items-center rounded-md border border-neutral-300 bg-transparent px-3 py-1 text-sm font-medium text-neutral-500">
              {trackerEngine.filteredJobs.length}
            </div>
            {selectedJobIds.length > 0 && (
              <Select
                options={actionOptions}
                value=""
                onChange={handleBulkAction}
                placeholder="Actions"
                className="w-32"
                buttonClassName="!h-7"
              />
            )}
          </div>
          <Tabs tabs={tabs} activeId={viewMode} onChange={setViewMode} />
        </div>
        {viewMode === 'table' ? (
          <TrackerTable
            {...trackerEngine}
            selectedJobIds={selectedJobIds}
            setSelectedJobIds={setSelectedJobIds}
            selectedDetailsJobId={selectedDetailsJobId}
            setSelectedDetailsJobId={setSelectedDetailsJobId}
          />
        ) : (
          <TrackerCards
            {...trackerEngine}
            selectedJobIds={selectedJobIds}
            setSelectedJobIds={setSelectedJobIds}
            selectedDetailsJobId={selectedDetailsJobId}
            setSelectedDetailsJobId={setSelectedDetailsJobId}
          />
        )}
      </main>

      <div
        className={`hidden shrink-0 overflow-hidden transition-[width] duration-300 ease-out md:block ${selectedDetailsJobId ? 'w-[400px] rounded-tl-md border-t border-l border-neutral-300' : 'w-0 rounded-tl-none border-transparent'}`}>
        <div className="h-full w-[400px]">
          <JobDetailsSidebar job={renderedJob} onClose={() => setSelectedDetailsJobId(null)} isDesktop />
        </div>
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 z-[100] transition-transform duration-300 ease-out md:hidden ${selectedDetailsJobId ? 'translate-y-0' : 'translate-y-full'}`}>
        <JobDetailsSidebar job={renderedJob} onClose={() => setSelectedDetailsJobId(null)} />
      </div>
    </div>
  );
}
