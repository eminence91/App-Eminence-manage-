import React from 'react';

interface TimelineItem {
  icon: React.ReactNode;
  title: string;
  content?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export default function Timeline({ items, className = '' }: TimelineProps) {
  return (
    <div className={`relative ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="relative flex gap-4 pb-6 last:pb-0">
          {/* Line */}
          {index < items.length - 1 && (
            <div className="absolute left-[17px] top-10 bottom-0 w-0.5 bg-primary-200" />
          )}

          {/* Circle icon */}
          <div className="relative z-10 flex-shrink-0 w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-sm">
            {item.icon}
          </div>

          {/* Content */}
          <div className="flex-1 pt-1">
            <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
            {item.content && <div className="mt-1 text-sm text-muted">{item.content}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
