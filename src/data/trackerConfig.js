export const statusOptions = ['Not Started', 'Applied', 'Phone Screen', 'Technical Interview', 'Onsite Interview', 'Offer', 'Rejected'];
export const platformOptions = ['LinkedIn', 'Indeed', 'Wellfound', 'Direct', 'Referral', 'Glassdoor', 'Other'];
export const priorityOptions = ['High', 'Medium', 'Low'];

export const trackerColumns = [
  { key: 'company', label: 'Company', width: 165, type: 'company', placeholder: 'Add Company' },
  { key: 'role', label: 'Role', width: 145, type: 'text', placeholder: 'Add Role' },
  { key: 'location', label: 'Location', width: 125, type: 'location', placeholder: 'Add Location' },
  { key: 'salary', label: 'Salary', width: 90, type: 'salary', placeholder: 'Add Salary' },
  { key: 'status', label: 'Status', width: 120, type: 'status', placeholder: 'Status' },
  { key: 'priority', label: 'Priority', width: 85, type: 'priority', placeholder: 'Priority' },
  { key: 'platform', label: 'Platform', width: 105, type: 'platform', placeholder: 'Platform' },
  { key: 'datePosted', label: 'Date', width: 90, type: 'date', placeholder: 'Today' },
  { key: 'notes', label: 'Notes', width: 200, type: 'textarea', placeholder: 'Add notes' },
  { key: '_details', label: 'More', width: 50, type: 'details' }
];
