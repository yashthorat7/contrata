import React, { useState, useRef } from 'react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input, Textarea } from '../components/ui/Input';
import { Checkbox } from '../components/ui/Checkbox';
import { Select } from '../components/ui/Select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { BadgeDropdown } from '../components/ui/BadgeDropdown';
import { ContextMenu } from '../components/ui/ContextMenu';
import { EditableSpan } from '../components/ui/EditableSpan';
import { EditableCell } from '../components/ui/EditableCell';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Sparkles, Trash } from '../components/ui/Icons';
import { Tooltip } from '../components/ui/Tooltip';
import { Tabs } from '../components/ui/Tabs';

export default function Styling() {
  const [isChecked, setIsChecked] = useState(true);
  const [selectValue, setSelectValue] = useState('');
  const [badgeVal, setBadgeVal] = useState('Applied');
  const [contextMenuState, setContextMenuState] = useState({ visible: false, x: 0, y: 0 });
  const [editableVal, setEditableVal] = useState('Click to edit me inline!');
  const editableRef = useRef(null);

  const handleContextMenu = e => {
    e.preventDefault();
    setContextMenuState({ visible: true, x: e.clientX, y: e.clientY });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-12 p-6">
      <div>
        <h1 className="font-serif text-3xl font-medium text-neutral-800">Styling & UI Library</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2" onContextMenu={handleContextMenu}>
        <section className="space-y-4">
          <h2 className="border-b border-neutral-300 pb-2 font-serif text-xl font-medium text-neutral-800">Buttons</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button isLoading>Loading</Button>
            <Tooltip content="Tooltip example!">
              <Button icon={Sparkles}>With Icon</Button>
            </Tooltip>
            <Button variant="outline" icon={Trash} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="border-b border-neutral-300 pb-2 font-serif text-xl font-medium text-neutral-800">Badges & Dropdowns</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="default">Default</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
          <div className="pt-2">
            <p className="mb-2 text-sm text-neutral-500">Badge Dropdown</p>
            <BadgeDropdown current={badgeVal} onSave={setBadgeVal} options={['Applied', 'Interviewing', 'Rejected']} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="border-b border-neutral-300 pb-2 font-serif text-xl font-medium text-neutral-800">Inputs & Controls</h2>
          <div className="space-y-4">
            <Input placeholder="Standard text input..." />
            <Textarea placeholder="Text area..." />

            <div className="pt-2">
              <Checkbox
                id="demo-checkbox"
                checked={isChecked}
                onChange={e => setIsChecked(e.target.checked)}
                label="Accept terms and conditions"
              />
            </div>

            <div className="pt-2">
              <Select
                value={selectValue}
                onChange={setSelectValue}
                options={[
                  { label: 'Option 1', value: 'opt1' },
                  { label: 'Option 2', value: 'opt2' },
                  { label: 'Option 3', value: 'opt3' }
                ]}
                placeholder="Select an option..."
              />
            </div>

            <div className="pt-2">
              <p className="mb-2 text-sm text-neutral-500">Tabs Toggle</p>
              <Tabs
                tabs={[
                  { id: 'tab1', label: 'Preview' },
                  { id: 'tab2', label: 'Code' },
                  { id: 'tab3', label: 'Settings' }
                ]}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="border-b border-neutral-300 pb-2 font-serif text-xl font-medium text-neutral-800">Editables</h2>
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-sm text-neutral-500">Editable Span</p>
              <EditableSpan
                value={editableVal}
                onChange={setEditableVal}
                inputRef={editableRef}
                placeholder="Type here..."
                className="border border-neutral-300 p-2"
              />
            </div>
            <div>
              <p className="mb-1 text-sm text-neutral-500">Editable Cell (Date)</p>
              <div className="w-48 rounded-md border border-neutral-300 bg-white">
                <EditableCell type="date" value="2026-07-01" onSave={() => {}} />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="space-y-4">
        <h2 className="border-b border-neutral-300 pb-2 font-serif text-xl font-medium text-neutral-800">Table</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Acme Corp</TableCell>
              <TableCell>Senior Engineer</TableCell>
              <TableCell>
                <Badge>Applied</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Globex</TableCell>
              <TableCell>Frontend Developer</TableCell>
              <TableCell>
                <Badge>Interviewing</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <section className="space-y-4">
        <h2 className="border-b border-neutral-300 pb-2 font-serif text-xl font-medium text-neutral-800">Cards</h2>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Example Card</CardTitle>
            <CardDescription>This is a standard flat card with zero shadows.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-700">
              Notice the pure outline border. This adheres perfectly to the minimal aesthetic defined in the design rules.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" className="w-full">
              Action
            </Button>
          </CardFooter>
        </Card>
      </section>

      <ContextMenu
        visible={contextMenuState.visible}
        x={contextMenuState.x}
        y={contextMenuState.y}
        onClose={() => setContextMenuState({ ...contextMenuState, visible: false })}
        items={[
          { label: 'Edit Item', onClick: () => console.log('Edit') },
          { label: 'Delete Item', onClick: () => console.log('Delete') }
        ]}
      />
    </div>
  );
}
