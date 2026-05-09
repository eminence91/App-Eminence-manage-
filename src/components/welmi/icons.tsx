import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (p: P) => ({
  width: p.size ?? 24,
  height: p.size ?? 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...p,
});

export const IconApple = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 20.94c1.5 0 2.75-1.06 4-3.06 1.5-2.5 2-5.94 2-7.94 0-3-2-4-3.5-4-1 0-2 .5-2.5 1.5-.5-1-1.5-1.5-2.5-1.5C8 5.94 6 6.94 6 9.94c0 2 .5 5.44 2 7.94 1.25 2 2.5 3.06 4 3.06z"/>
    <path d="M12 6.94c-.5-1 .5-3 2-3"/>
  </svg>
);

export const IconShoe = (p: P) => (
  <svg {...base(p)}>
    <path d="M2 16c2 0 3 2 8 2s12-3 12-5c0-1-.5-2-2-2-1 0-2.5 0-4-1-2-1.33-3-3-5-3-2.5 0-4 2-4 4v1c-1 0-2 0-3 1S2 14 2 16z"/>
  </svg>
);

export const IconChart = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 20V10M12 20V4M19 20v-6"/>
  </svg>
);

export const IconPlus = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14"/>
  </svg>
);

export const IconCalendar = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

export const IconUser = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 22c0-4.42 3.58-8 8-8s8 3.58 8 8H4z" />
  </svg>
);

export const IconFlame = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 2c-1 4 3 5 3 9a3 3 0 0 1-6 0c0-2 2-3 2-5-3 1-5 4-5 7a6 6 0 0 0 12 0c0-5-6-7-6-11z"/>
  </svg>
);

export const IconBolt = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>
  </svg>
);

export const IconDumbbell = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 8v8M3 11v2M18 8v8M21 11v2M6 12h12"/>
  </svg>
);

export const IconArrowRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 5l7 7-7 7"/>
  </svg>
);

export const IconChevronRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 6l6 6-6 6"/>
  </svg>
);

export const IconChevronLeft = (p: P) => (
  <svg {...base(p)}>
    <path d="M15 6l-6 6 6 6"/>
  </svg>
);

export const IconClose = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6L6 18"/>
  </svg>
);

export const IconDrop = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 2c-4 6-7 10-7 13a7 7 0 0 0 14 0c0-3-3-7-7-13z"/>
  </svg>
);

export const IconScale = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="18" height="18" rx="3"/>
    <path d="M9 8h6M12 8v3"/>
  </svg>
);

export const IconHeart = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 21s-7-4.5-9.5-9C.5 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4 4.5 8-2.5 4.5-9.5 9-9.5 9z"/>
  </svg>
);

export const IconBody = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="5" r="2"/>
    <path d="M9 22V12l-3-2 3-4h6l3 4-3 2v10"/>
  </svg>
);

export const IconUtensils = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 2v8a2 2 0 0 0 2 2v10M7 2v8M5 2v8M21 2v20M21 14h-4V6a4 4 0 0 1 4-4"/>
  </svg>
);

export const IconClock = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 7v5l3 2"/>
  </svg>
);

export const IconHeadphones = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 18v-5a9 9 0 0 1 18 0v5"/>
    <rect x="3" y="14" width="4" height="7" rx="1"/>
    <rect x="17" y="14" width="4" height="7" rx="1"/>
  </svg>
);

export const IconGrid = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

export const IconRuler = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 7h18v10H3z"/>
    <path d="M7 7v3M11 7v3M15 7v3M19 7v3"/>
  </svg>
);

export const IconGlobe = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a14 14 0 0 1 0 20M12 2a14 14 0 0 0 0 20"/>
  </svg>
);

export const IconSearch = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7"/>
    <path d="M21 21l-4.5-4.5"/>
  </svg>
);

export const IconStar = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 2l2.9 6.9L22 10l-5.5 5L18 22l-6-3.5L6 22l1.5-7L2 10l7.1-1.1z"/>
  </svg>
);

export const IconMic = (p: P) => (
  <svg {...base(p)}>
    <rect x="9" y="3" width="6" height="12" rx="3"/>
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>
  </svg>
);

export const IconScan = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export const IconWalk = (p: P) => (
  <svg {...base(p)}>
    <circle cx="13" cy="4" r="2"/>
    <path d="M9 22l3-7 4 2 2-4M5 13l4-2 2-4"/>
  </svg>
);

export const IconRun = (p: P) => (
  <svg {...base(p)}>
    <circle cx="14" cy="4" r="2"/>
    <path d="M5 21l3-6 4 1 2-5 4 4M3 13l5-3 2 3"/>
  </svg>
);

export const IconChat = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2z"/>
  </svg>
);

export const IconHelp = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 4M12 17h.01" stroke="white" strokeWidth="2" fill="none"/>
  </svg>
);

export const IconSend = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M3 11l18-8-8 18-2-7-8-3z"/>
  </svg>
);

export const IconBed = (p: P) => (
  <svg {...base(p)}>
    <path d="M2 18v-6h20v6M2 18h20M2 12V8a2 2 0 0 1 2-2h6v6M14 6h6a2 2 0 0 1 2 2v4"/>
  </svg>
);

export const IconCarrot = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M3 21l8-8a5 5 0 0 1 7 0l-8 8a4 4 0 0 1-7 0z" fill="#F97316"/>
    <path d="M14 4l2-2M18 6l2-2M16 8l2-2" stroke="#16A34A" strokeWidth="2" fill="none"/>
  </svg>
);
