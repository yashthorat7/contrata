import React from 'react';
import { RangeInput } from '../ui/RangeInput';
import { formatSalaryCompact } from '../../utils/salary';

const STEPS = [
  0, 500, 1_000, 2_000, 5_000, 10_000, 20_000, 30_000, 50_000, 75_000, 100_000, 150_000, 200_000, 300_000, 500_000, 750_000, 1_000_000,
  2_000_000, 5_000_000, 10_000_000
];

export function SalaryRangeFilter({ min, max, onMinChange, onMaxChange }) {
  return <RangeInput steps={STEPS} format={formatSalaryCompact} min={min} max={max} onMinChange={onMinChange} onMaxChange={onMaxChange} />;
}
