import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';

export default function SettingsOptionsCard({ title, description, options, setOptions, defaultOption, placeholder }) {
  const [newVal, setNewVal] = useState('');

  const handleAdd = e => {
    e.preventDefault();
    const val = newVal.trim();
    if (!val || options.includes(val)) return;
    setOptions([...options, val]);
    setNewVal('');
  };

  const handleRemove = val => {
    if (val === defaultOption) return;
    setOptions(options.filter(item => item !== val));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {options.map(opt => (
            <Badge key={opt} variant="outline" className="gap-1.5 !px-2.5 !py-1 text-neutral-800">
              {opt}
              {opt === defaultOption ? (
                <span className="text-[10px] font-normal text-neutral-400">(Default)</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRemove(opt)}
                  className="ml-0.5 text-neutral-400 transition-colors hover:text-neutral-900 focus:outline-none">
                  ×
                </button>
              )}
            </Badge>
          ))}
        </div>
        <form onSubmit={handleAdd} className="flex max-w-sm gap-2">
          <Input type="text" value={newVal} onChange={e => setNewVal(e.target.value)} placeholder={placeholder} className="flex-1" />
          <Button type="submit" variant="outline" size="default" disabled={!newVal.trim()}>
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
