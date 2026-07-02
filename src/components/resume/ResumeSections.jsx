import React from 'react';
import { parseMarkdownFormattingReact } from '../../utils/resumeParser';

export function ResumeHeader({ name, contact }) {
  return (
    <section className="header-section">
      <h1>{name}</h1>
      <div
        className="header-contacts"
        dangerouslySetInnerHTML={{
          __html: contact.map(item => parseMarkdownFormattingReact(item)).join('<span class="contact-dot">•</span>')
        }}
      />
    </section>
  );
}

export function ExperienceSection({ items }) {
  return (
    <div className="w-full">
      {items.map((item, itemIdx) => {
        if (item.type === 'subsection') {
          const parts = item.title.split('|').map(p => p.trim());
          const company = parts[0] ? parseMarkdownFormattingReact(parts[0]) : '';
          const role = parts[1] ? parseMarkdownFormattingReact(parts[1]) : '';
          const date = parts[2] ? parts[2] : '';
          const headerClass = itemIdx === 0 ? 'entry-header' : 'entry-header mt-entry';
          return (
            <div key={itemIdx} className="w-full">
              <div className={headerClass}>
                <div className="entry-title">
                  <h3 dangerouslySetInnerHTML={{ __html: company }} />
                  {role && <span className="entry-role" dangerouslySetInnerHTML={{ __html: role }} />}
                </div>
                {date && <div className="entry-date">{date}</div>}
              </div>
              <ul className="bullet-list">
                {item.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="bullet-item" dangerouslySetInnerHTML={{ __html: parseMarkdownFormattingReact(bullet) }} />
                ))}
              </ul>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export function AchievementsSection({ items }) {
  return (
    <ul className="achievement-list mt-entry">
      {items.map((item, itemIdx) => (
        <li key={itemIdx} className="achievement-item" dangerouslySetInnerHTML={{ __html: parseMarkdownFormattingReact(item.content) }} />
      ))}
    </ul>
  );
}

export function SkillsSection({ items }) {
  return (
    <div className="skills-container mt-entry">
      {items.map((item, itemIdx) => {
        const lineText = item.content;
        const match = lineText.match(/^\*\*(.*?)\*\*:\s*(.*)$/);
        if (match) {
          const skillTitle = match[1];
          const skillItemsText = match[2];
          const skillItems = skillItemsText.split('•').map(s => s.trim());
          return (
            <div key={itemIdx} className="skill-row">
              <h3 className="skill-title" dangerouslySetInnerHTML={{ __html: skillTitle }} />
              <span className="pipe-sep">
                <svg viewBox="0 0 6 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter">
                  <line x1="3" y1="2" x2="3" y2="22"></line>
                </svg>
              </span>
              <div className="skill-list">
                {skillItems.map((sItem, sIdx) => (
                  <React.Fragment key={sIdx}>
                    <span className="skill-item-text" dangerouslySetInnerHTML={{ __html: parseMarkdownFormattingReact(sItem) }} />
                    {sIdx < skillItems.length - 1 && <span className="skill-dot">•</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export function EducationSection({ items }) {
  return (
    <div className="education-container mt-entry">
      {items.map((item, itemIdx) => {
        const parts = item.content.split('|').map(p => p.trim());
        const spansHtml = parts
          .map(part => parseMarkdownFormattingReact(part).replace(/class="font-normal"/g, 'class="edu-bold"'))
          .join(
            '<span class="pipe-sep"><svg viewBox="0 0 6 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" strokeLinejoin="miter"><line x1="3" y1="2" x2="3" y2="22"></line></svg></span>'
          );
        return <div key={itemIdx} className="edu-row" dangerouslySetInnerHTML={{ __html: spansHtml }} />;
      })}
    </div>
  );
}

export function ResumeSectionsList({ sections }) {
  return (
    <>
      {sections.map((section, sIdx) => (
        <section key={sIdx} className="w-full">
          <h2 className="section-title">{section.title}</h2>
          {(section.key === 'experience' || section.key === 'projects') && <ExperienceSection items={section.items} />}
          {section.key === 'achievements' && <AchievementsSection items={section.items} />}
          {section.key === 'skills' && <SkillsSection items={section.items} />}
          {section.key === 'education' && <EducationSection items={section.items} />}
        </section>
      ))}
    </>
  );
}
