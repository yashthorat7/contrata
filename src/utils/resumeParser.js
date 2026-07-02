export function parseMarkdownFormattingReact(text) {
  if (!text) return '';
  const arrowSvg = `<span class="arrow-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter"><line x1="6" y1="18" x2="17" y2="7"></line><polyline points="9 6 18 6 18 15"></polyline></svg></span>`;
  return text.replace(/\*\*(.*?)\*\*/g, '<span class="font-normal">$1</span>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
    if (url.startsWith('tel:')) return `<a href="${url}" class="contact-link">${label}</a>`;
    const isEmail = url.startsWith('mailto:') || (url.includes('@') && !url.includes('://'));
    const targetUrl = isEmail ? `https://mail.google.com/mail/?view=cm&fs=1&to=${url.startsWith('mailto:') ? url.substring(7) : url}` : url;
    return `<a href="${targetUrl}" class="contact-link" target="_blank" rel="noopener noreferrer">${label}&thinsp;${arrowSvg}</a>`;
  });
}

export function parseResumeMarkdown(mdText) {
  if (!mdText) return { name: '', contact: [], sections: [] };
  const lines = mdText.split(/\r?\n/);
  const resume = { name: '', contact: [], sections: [] };
  let currentSection = null;
  let currentSubsection = null;
  const handleListItem = val => {
    if (currentSection?.key === 'header') {
      resume.contact.push(val);
    } else if (currentSubsection) {
      currentSubsection.bullets.push(val);
    } else if (currentSection) {
      currentSection.items.push({ type: 'list-item', content: val });
    }
  };
  const actionMap = {
    '### ': val => {
      currentSubsection = { type: 'subsection', title: val, bullets: [] };
      if (currentSection) currentSection.items.push(currentSubsection);
    },
    '## ': val => {
      currentSection = { title: val, key: val.toLowerCase(), items: [] };
      resume.sections.push(currentSection);
      currentSubsection = null;
    },
    '# ': val => {
      resume.name = val;
      currentSection = { key: 'header', items: [] };
    },
    '- ': handleListItem,
    '* ': handleListItem
  };
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    const prefix = Object.keys(actionMap).find(p => line.startsWith(p));
    if (prefix) {
      actionMap[prefix](line.substring(prefix.length).trim());
    }
  }
  return resume;
}
