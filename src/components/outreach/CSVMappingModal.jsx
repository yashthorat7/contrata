import React from 'react';
import { XSquare } from '../ui/Icons';
import { Button } from '../ui/Button';

export function CSVMappingModal({ setShowCSVModal, csvHeaders, csvRows, columnMapping, setColumnMapping, executeCSVImport }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/30 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-md border border-neutral-300 bg-white p-5">
        <div className="mb-4 flex items-center justify-between border-b border-neutral-200 pb-3">
          <h3 className="font-serif text-lg text-neutral-900">Map CSV Columns</h3>
          <button onClick={() => setShowCSVModal(false)} className="text-neutral-400 hover:text-neutral-600">
            <XSquare className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
          <p className="text-xs text-neutral-500">
            Match the fields required by HireFirst to the headers extracted from your uploaded CSV.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'company', label: 'Company Name *' },
              { key: 'role', label: 'Job Title / Role *' },
              { key: 'recruiterName', label: 'Recruiter Name' },
              { key: 'recruiterEmail', label: 'Recruiter Email' },
              { key: 'recruiterLinkedin', label: 'Recruiter LinkedIn' },
              { key: 'description', label: 'Job Description' },
              { key: 'location', label: 'Location' },
              { key: 'salary', label: 'Salary Info' }
            ].map(field => (
              <div key={field.key}>
                <label className="mb-1 block text-xs font-semibold text-neutral-600">{field.label}</label>
                <select
                  value={columnMapping[field.key] !== undefined ? columnMapping[field.key] : ''}
                  onChange={e => {
                    const val = e.target.value;
                    setColumnMapping(prev => ({
                      ...prev,
                      [field.key]: val === '' ? undefined : parseInt(val, 10)
                    }));
                  }}
                  className="h-8 w-full rounded-md border border-neutral-300 bg-white px-2 text-xs text-neutral-800 focus:border-neutral-400 focus:outline-none">
                  <option value="">-- Skip Field --</option>
                  {csvHeaders.map((hdr, idx) => (
                    <option key={idx} value={idx}>
                      {hdr}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div>
            <h4 className="mb-2 text-xs font-semibold text-neutral-600">CSV Rows Preview (First 3)</h4>
            <div className="overflow-x-auto rounded border border-neutral-300">
              <table className="min-w-full text-[11px] text-neutral-700">
                <thead className="border-b border-neutral-300 bg-neutral-50">
                  <tr>
                    {csvHeaders.map((hdr, idx) => (
                      <th key={idx} className="border-r border-neutral-300 px-2 py-1.5 text-left font-semibold last:border-r-0">
                        {hdr}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvRows.slice(0, 3).map((row, rIdx) => (
                    <tr key={rIdx} className="border-b border-neutral-200 last:border-0">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="max-w-[120px] truncate border-r border-neutral-200 px-2 py-1.5 last:border-r-0">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2 border-t border-neutral-200 pt-3">
          <Button variant="outline" size="sm" onClick={() => setShowCSVModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={executeCSVImport}>
            Import {csvRows.length} Leads
          </Button>
        </div>
      </div>
    </div>
  );
}
