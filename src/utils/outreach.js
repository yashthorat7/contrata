export function parseCSV(text) {
  const lines = [];
  let row = [''];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') {
        i++;
      }
      lines.push(row);
      row = [''];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== '') {
    lines.push(row);
  }
  return lines;
}

export function extractEmail(text) {
  if (!text) return null;
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
}

export function suggestEmail(companyName) {
  if (!companyName) return '';
  const domain = companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
  return `recruiter@${domain}`;
}

export function parseOutreachResponse(text) {
  const result = {
    coldEmailSubject: '',
    coldEmailBody: '',
    coverLetter: '',
    linkedinMessage: ''
  };
  if (!text) return result;

  const extractSection = tag => {
    const regex = new RegExp(`\\[\\[${tag}\\]\\]\\s*([\\s\\S]*?)(?=\\[\\[|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  result.coldEmailSubject = extractSection('COLD_EMAIL_SUBJECT');
  result.coldEmailBody = extractSection('COLD_EMAIL_BODY');
  result.coverLetter = extractSection('COVER_LETTER');
  result.linkedinMessage = extractSection('LINKEDIN_MESSAGE');

  if (!Object.values(result).some(Boolean)) {
    const lines = text.split('\n');
    let currentKey = null;
    let currentText = [];
    for (let line of lines) {
      const lower = line.toLowerCase();
      if (lower.startsWith('subject:')) {
        if (currentKey) result[currentKey] = currentText.join('\n').trim();
        currentKey = 'coldEmailSubject';
        currentText = [line.substring(line.indexOf(':') + 1).trim()];
      } else if (lower.includes('cold email') || lower.includes('email body')) {
        if (currentKey) result[currentKey] = currentText.join('\n').trim();
        currentKey = 'coldEmailBody';
        currentText = [];
      } else if (lower.includes('cover letter')) {
        if (currentKey) result[currentKey] = currentText.join('\n').trim();
        currentKey = 'coverLetter';
        currentText = [];
      } else if (lower.includes('linkedin')) {
        if (currentKey) result[currentKey] = currentText.join('\n').trim();
        currentKey = 'linkedinMessage';
        currentText = [];
      } else {
        if (currentKey) {
          currentText.push(line);
        }
      }
    }
    if (currentKey) {
      result[currentKey] = currentText.join('\n').trim();
    }
  }
  return result;
}

export function generatePrompt(job, resumeMd = '') {
  if (!job) return '';
  return `Write a tailored cold email, cover letter, and short LinkedIn message/connection request for this job application.

---
CANDIDATE INFO/RESUME:
${resumeMd || 'No profile context loaded'}

---
JOB ROLE:
${job.role || 'Not specified'}

COMPANY:
${job.company || 'Not specified'}

JOB DESCRIPTION:
${job.description || 'Not specified'}

RECRUITER NAME:
${job.recruiter?.name || 'Hiring Manager'}
---

You MUST structure your response EXACTLY like the format below, using these tags to separate sections:

[[COLD_EMAIL_SUBJECT]]
[Subject Line Here]

[[COLD_EMAIL_BODY]]
[Email Body Here]

[[COVER_LETTER]]
[Cover Letter Here]

[[LINKEDIN_MESSAGE]]
[LinkedIn Message Here]`;
}
