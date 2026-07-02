export function formatIndianSalary(v) {
  if (!v) return String(v ?? '');
  const str = String(v).trim();
  let numStr = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] >= '0' && str[i] <= '9') {
      numStr += str[i];
    }
  }
  return numStr ? new Intl.NumberFormat('en-IN').format(parseInt(numStr, 10)) : str;
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = String(d.getFullYear()).slice(-2);
    return `${day} ${month} ${year}`;
  } catch (e) {
    return dateStr;
  }
}
