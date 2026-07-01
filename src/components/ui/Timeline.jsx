import React from 'react';

export function Timeline({ children, className = '' }) {
  return <div className={`relative flex flex-col ${className}`}>{children}</div>;
}

export function TimelineItem({
  variant = 'number', // number or dot
  indicator,
  title,
  description,
  headerRight,
  children,
  isLast = false,
  bulletPt = 'pt-2'
}) {
  const isNote = variant === 'dot';

  return (
    <div className="relative flex items-start gap-4">
      {!isLast && !isNote && <div className="absolute top-12 -bottom-4 left-6 w-[1px] bg-neutral-300"></div>}

      {isNote ? (
        <div className={`relative z-10 flex w-12 flex-shrink-0 justify-center ${bulletPt}`}>
          <div className="h-2 w-2 rounded-[2px] bg-neutral-400"></div>
        </div>
      ) : (
        <div className="z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md border border-neutral-300 bg-white font-serif text-lg font-medium text-neutral-800">
          {indicator}
        </div>
      )}

      <div className={`w-full flex-1 pt-1 ${isNote ? 'pb-4' : 'pb-16'}`}>
        {!isNote && (title || description || headerRight) && (
          <div className={`flex items-start justify-between ${children ? 'mb-5' : 'mb-0'}`}>
            <div>
              {title && <h3 className="mb-1 font-serif text-xl leading-none font-normal text-neutral-900">{title}</h3>}
              {description && <div className="text-sm leading-relaxed text-neutral-400">{description}</div>}
            </div>
            {headerRight && headerRight}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
