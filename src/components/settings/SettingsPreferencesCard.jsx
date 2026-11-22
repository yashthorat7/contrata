import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { ConfirmButton } from '../ui/Button';

export default function SettingsPreferencesCard({ searchConfig, updateSearchConfig, resetSearchConfig }) {
  const fields = [
    { key: 'jobType', label: 'Job Type', placeholder: 'e.g. internship / full-time' },
    { key: 'experienceLevel', label: 'Experience Level', placeholder: 'e.g. entry-level / senior' },
    { key: 'targetWebsites', label: 'Target Platforms', placeholder: 'e.g. linkedin, indeed' },
    { key: 'location', label: 'Preferred Location', placeholder: 'e.g. Remote / New York' },
    { key: 'salary', label: 'Minimum Salary / Stipend', placeholder: 'e.g. $100k / $5000/mo' },
    { key: 'publishedAge', label: 'Posting Age Window', placeholder: 'e.g. 7 days' },
    { key: 'listingsLimit', label: 'Listing Results Cap', placeholder: 'e.g. 25' },
    { key: 'customNotes', label: 'Custom Constraints & Notes', placeholder: 'e.g. React, Node, AI startup' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Search Preferences</CardTitle>
            <CardDescription>
              Configure default parameters for search prompts and live scraping. Synced with the Home preferences.
            </CardDescription>
          </div>
          <ConfirmButton variant="outline" size="sm" className="shrink-0 whitespace-nowrap" onConfirm={resetSearchConfig}>
            Reset Defaults
          </ConfirmButton>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map(({ key, label, placeholder }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-neutral-600">{label}</label>
              <Input
                type="text"
                value={searchConfig[key] || ''}
                onChange={e => updateSearchConfig(key, e.target.value)}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
