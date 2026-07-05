import React from 'react';
import { useTrackerOptions } from '../hooks/useTrackerOptions';
import SettingsOptionsCard from '../components/settings/SettingsOptionsCard';
import SettingsLLMKeys from '../components/settings/SettingsLLMKeys';
import SettingsDataExport from '../components/settings/SettingsDataExport';

export default function Settings() {
  const { statusOptions, platformOptions, setStatusOptions, setPlatformOptions } = useTrackerOptions();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 font-sans antialiased lg:px-0">
      <div className="mb-16 flex flex-col gap-2">
        <h1 className="font-serif text-4xl leading-tight font-normal text-neutral-900">Settings</h1>
        <p className="text-sm text-neutral-500">Configure application preferences and manage your data.</p>
      </div>

      <div className="space-y-6">
        <SettingsOptionsCard
          title="Job Options Listing (Platforms)"
          description='Manage platform and job board options used in badges, tables, and filters. "LinkedIn" is required and cannot be removed.'
          options={platformOptions}
          setOptions={setPlatformOptions}
          defaultOption="LinkedIn"
          placeholder="Add new platform..."
        />
        <SettingsOptionsCard
          title="Status Listing"
          description='Manage application status options used in badges, tables, and filters. "Not Started" is required and cannot be removed.'
          options={statusOptions}
          setOptions={setStatusOptions}
          defaultOption="Not Started"
          placeholder="Add new status..."
        />
        <SettingsLLMKeys />
        <SettingsDataExport />
      </div>
    </main>
  );
}
