export function autoAdjustSpacing(container) {
  const page = container.closest('.page-content');
  if (!page) return;
  const bulletLists = container.querySelectorAll('.bullet-list');
  bulletLists.forEach(list => {
    const items = list.querySelectorAll('.bullet-item');
    if (items.length > 0) items[items.length - 1].style.marginBottom = '0';
  });
  const achItems = container.querySelectorAll('.achievement-item');
  if (achItems.length > 0) achItems[achItems.length - 1].style.marginBottom = '0';

  function applySpacing(target, s) {
    target.style.setProperty('--line-height-base', s.lineHeight);
    target.style.setProperty('--spacing-section-gap', s.sectionGap + 'mm');
    target.style.setProperty('--spacing-after-title', s.afterTitle + 'mm');
    target.style.setProperty('--spacing-entry-gap', s.entryGap + 'mm');
    target.style.setProperty('--spacing-bullet-gap', s.bulletGap + 'mm');
    target.style.setProperty('--spacing-bullet-top', s.bulletTop + 'mm');
    target.style.setProperty('--spacing-skill-row-gap', s.skillRowGap + 'mm');
    target.style.setProperty('--spacing-edu-row-gap', s.eduRowGap + 'mm');
    target.style.setProperty('--spacing-achievement-gap', s.achievementGap + 'mm');
  }

  function getSpacingForScale(scale) {
    if (scale <= 1.0) {
      return {
        lineHeight: 1.2 * scale,
        sectionGap: 2.0 * scale,
        afterTitle: 1.0 * scale,
        entryGap: 1.0 * scale,
        bulletGap: 0.5 * scale,
        bulletTop: 0.4 * scale,
        skillRowGap: 0.3 * scale,
        eduRowGap: 0.6 * scale,
        achievementGap: 0.3 * scale
      };
    } else {
      return {
        lineHeight: 1.2,
        sectionGap: Math.min(2.0 * scale, 12),
        afterTitle: Math.min(1.0 * scale, 4),
        entryGap: Math.min(1.0 * scale, 4),
        bulletGap: Math.min(0.5 * scale, 3.5),
        bulletTop: Math.min(0.4 * scale, 3),
        skillRowGap: Math.min(0.3 * scale, 2.5),
        eduRowGap: Math.min(0.6 * scale, 3),
        achievementGap: Math.min(0.3 * scale, 2)
      };
    }
  }

  applySpacing(page, getSpacingForScale(1.0));
  void page.offsetHeight;
  const pageHeight = page.clientHeight;
  page.style.height = 'auto';
  page.style.overflow = 'visible';
  void page.offsetHeight;
  const baselineHeight = page.offsetHeight;
  let low, high;
  if (baselineHeight > pageHeight) {
    low = 0.0;
    high = 1.0;
  } else {
    low = 1.0;
    high = 10.0;
  }
  let optimalScale = low;
  for (let i = 0; i < 12; i++) {
    const mid = (low + high) / 2;
    applySpacing(page, getSpacingForScale(mid));
    void page.offsetHeight;
    const height = page.offsetHeight;
    if (height > pageHeight) high = mid;
    else {
      optimalScale = mid;
      low = mid;
    }
  }
  page.style.height = '';
  page.style.overflow = '';
  applySpacing(page, getSpacingForScale(optimalScale));
}
