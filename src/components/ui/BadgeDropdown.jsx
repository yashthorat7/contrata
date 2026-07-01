import React, { useMemo } from 'react';
import { Dropdown } from './Dropdown';
import { Badge } from './Badge';

export function BadgeDropdown({ current, typeMap, onSave }) {
  const options = useMemo(() => Object.keys(typeMap), [typeMap]);
  return (
    <Dropdown
      trigger={
        <button type="button" className="block cursor-pointer border-0 bg-transparent p-0 outline-none">
          <Badge variant={typeMap[current] || 'default'}>{current}</Badge>
        </button>
      }>
      {({ close }) => (
        <div className="font-sans text-[13px] font-medium text-neutral-700 select-none">
          {options.map(name => (
            <button
              key={name}
              type="button"
              className="flex w-full cursor-pointer items-center border-0 bg-transparent px-2 py-1.5 text-left transition duration-100 outline-none hover:bg-neutral-50"
              onClick={() => {
                if (current !== name) onSave(name);
                close();
              }}>
              <Badge variant={typeMap[name]}>{name}</Badge>
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  );
}
