import React, { useMemo } from 'react';
import { Dropdown } from './Dropdown';
import { Badge } from './Badge';

export function BadgeDropdown({ current, options, onSave }) {
  const filteredOptions = useMemo(() => options.filter(name => name !== current), [options, current]);
  return (
    <Dropdown
      trigger={
        <button type="button" className="block cursor-pointer border-0 bg-transparent p-0 outline-none">
          <Badge variant="default">{current}</Badge>
        </button>
      }>
      {({ close }) => (
        <div className="font-sans text-[13px] font-medium text-neutral-700 select-none">
          {filteredOptions.map(name => (
            <button
              key={name}
              type="button"
              className="flex w-full cursor-pointer items-center border-0 bg-transparent px-2 py-1.5 text-left transition duration-100 outline-none hover:bg-neutral-100"
              onClick={() => {
                if (current !== name) onSave(name);
                close();
              }}>
              <Badge variant="default">{name}</Badge>
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  );
}
