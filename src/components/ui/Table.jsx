import React from 'react';

export function Table({ className = '', children, ...props }) {
  return (
    <div className="w-full overflow-auto rounded-md border border-neutral-300 bg-white">
      <table className={`w-full caption-bottom text-sm ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className = '', children, ...props }) {
  return (
    <thead className={`border-b border-neutral-300 bg-neutral-50/50 ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ className = '', children, ...props }) {
  return (
    <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ className = '', children, ...props }) {
  return (
    <tr className={`border-b border-neutral-300 transition-colors hover:bg-neutral-50/50 ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ className = '', children, ...props }) {
  return (
    <th
      className={`h-8 border-r border-neutral-300 px-2 py-1.5 text-left align-middle font-medium text-neutral-600 last:border-r-0 ${className}`}
      {...props}>
      {children}
    </th>
  );
}

export function TableCell({ className = '', children, ...props }) {
  return (
    <td className={`border-r border-neutral-300 px-2 py-1.5 align-middle text-neutral-800 last:border-r-0 ${className}`} {...props}>
      {children}
    </td>
  );
}
