import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { storage } from '../../utils/storage';

export default function SettingsDataExport() {
  const handleExport = () => {
    const jobs = storage.get('job_hunter_jobs', []);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jobs, null, 2));
    const ts = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `contrata_${ts}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Export</CardTitle>
        <CardDescription>Export all your tracked job applications, status history, and notes as a JSON file.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="primary" onClick={handleExport}>
          Export Table
        </Button>
      </CardContent>
    </Card>
  );
}
