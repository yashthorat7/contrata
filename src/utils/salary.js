function parseSingleValue(raw) {
  if (!raw) return null;
  const s = raw.toString().trim();

  const cleaned = s.replace(/[$£€₹₩¥,\s]/g, '');
  if (!cleaned) return null;

  const lower = cleaned.toLowerCase();

  const m = lower.match(/^(\d+(?:\.\d+)?)(k|l|lac|lakh|cr|crore)?$/);
  if (!m) return null;

  const num = parseFloat(m[1]);
  const suffix = m[2] || '';

  if (suffix === 'k') return num * 1_000;
  if (suffix === 'l' || suffix === 'lac' || suffix === 'lakh') return num * 100_000;
  if (suffix === 'cr' || suffix === 'crore') return num * 10_000_000;
  return num;
}

export function parseSalaryToNumber(salaryStr) {
  if (!salaryStr) return null;
  const parts = salaryStr
    .split(/[-–~]|\bto\b/i)
    .map(p => parseSingleValue(p))
    .filter(v => v !== null && !isNaN(v));

  if (parts.length === 0) return null;
  return parts.reduce((a, b) => a + b, 0) / parts.length;
}

export function formatSalaryCompact(val) {
  if (!val || val === 0) return 'Any';
  if (val >= 10_000_000) return `${Math.round(val / 10_000_000)}cr`;
  if (val >= 100_000) return `${Math.round(val / 100_000)}L`;
  if (val >= 1_000) return `${Math.round(val / 1_000)}k`;
  return String(val);
}
