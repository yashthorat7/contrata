import React, { useState, useMemo } from 'react';
import { useOutreach } from '../hooks/useOutreach';
import { parseCSV, parseOutreachResponse, generatePrompt } from '../utils/outreach';

import {
  OutreachHeader,
  OutreachEmptyState,
  OutreachRecruiterDetails,
  OutreachAIWorkspace,
  OutreachOutputs,
  CSVMappingModal
} from '../components/outreach';

export default function Outreach() {
  const { jobs, selectedJobId, selectedJob, setSelectedJobId, updateJobOutreach, updateJobRecruiter, importJobsFromCSV, resumeMd } =
    useOutreach();

  const [activeTab, setActiveTab] = useState('email');
  const [copiedField, setCopiedField] = useState(null);
  const [pasteValue, setPasteValue] = useState('');

  const [showCSVModal, setShowCSVModal] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvRows, setCsvRows] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const leadOptions = useMemo(() => {
    return jobs.map(job => ({
      label: `${job.company} — ${job.role}${job.recruiter?.email ? ' ✉' : ''}`,
      value: job.id
    }));
  }, [jobs]);

  const handlePasteResponse = e => {
    const text = e.target.value;
    setPasteValue(text);
    if (!text.trim() || !selectedJob) return;

    const parsed = parseOutreachResponse(text);
    if (Object.values(parsed).some(Boolean)) {
      updateJobOutreach(selectedJob.id, parsed);
      setPasteValue('');
    }
  };

  const handleCSVUpload = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const rawText = event.target.result;
      const parsed = parseCSV(rawText);
      if (parsed.length < 2) return;

      const headers = parsed[0].map(h => h.trim());
      const rows = parsed.slice(1).filter(r => r.some(Boolean));

      setCsvHeaders(headers);
      setCsvRows(rows);

      const initialMapping = {};
      headers.forEach((header, index) => {
        const h = header.toLowerCase();
        if (h.includes('company')) initialMapping.company = index;
        else if (h.includes('role') || h.includes('title')) initialMapping.role = index;
        else if (h.includes('email')) initialMapping.recruiterEmail = index;
        else if (h.includes('name')) initialMapping.recruiterName = index;
        else if (h.includes('linkedin')) initialMapping.recruiterLinkedin = index;
        else if (h.includes('desc') || h.includes('detail')) initialMapping.description = index;
        else if (h.includes('loc')) initialMapping.location = index;
        else if (h.includes('sal')) initialMapping.salary = index;
      });

      setColumnMapping(initialMapping);
      setShowCSVModal(true);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const executeCSVImport = () => {
    if (columnMapping.company !== undefined && columnMapping.role !== undefined) {
      importJobsFromCSV(csvRows, columnMapping);
      setShowCSVModal(false);
    }
  };

  const currentPrompt = selectedJob ? generatePrompt(selectedJob, resumeMd) : '';

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 font-sans antialiased lg:px-0">
      <OutreachHeader
        leadOptions={leadOptions}
        selectedJobId={selectedJobId}
        setSelectedJobId={setSelectedJobId}
        selectedJob={selectedJob}
        currentPrompt={currentPrompt}
        handleCopy={handleCopy}
        copiedField={copiedField}
        handleCSVUpload={handleCSVUpload}
      />

      {!selectedJob ? (
        <OutreachEmptyState />
      ) : (
        <div className="space-y-12">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span className="rounded border border-neutral-300 bg-neutral-100/50 px-1.5 py-0.5 text-xs text-neutral-600">
              {selectedJob.platform || 'Direct'}
            </span>
            {selectedJob.postingLink && (
              <>
                <span>•</span>
                <a
                  href={selectedJob.postingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-neutral-600 underline hover:text-neutral-900">
                  Posting Link
                </a>
              </>
            )}
          </div>

          <OutreachRecruiterDetails selectedJob={selectedJob} updateJobRecruiter={updateJobRecruiter} />

          <OutreachAIWorkspace pasteValue={pasteValue} handlePasteResponse={handlePasteResponse} />

          <OutreachOutputs
            selectedJob={selectedJob}
            updateJobRecruiter={updateJobRecruiter}
            updateJobOutreach={updateJobOutreach}
            handleCopy={handleCopy}
            copiedField={copiedField}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      )}

      {showCSVModal && (
        <CSVMappingModal
          setShowCSVModal={setShowCSVModal}
          csvHeaders={csvHeaders}
          csvRows={csvRows}
          columnMapping={columnMapping}
          setColumnMapping={setColumnMapping}
          executeCSVImport={executeCSVImport}
        />
      )}
    </main>
  );
}
