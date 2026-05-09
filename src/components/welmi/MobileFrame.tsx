"use client";

import type { ReactNode } from "react";

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-neutral-200 flex items-center justify-center md:p-6">
      <div className="relative w-full md:w-[420px] md:rounded-[44px] md:overflow-hidden md:shadow-[0_30px_80px_rgba(0,0,0,0.25)] md:border-[10px] md:border-black md:h-[860px] bg-welmi-bg">
        <div className="relative h-full w-full overflow-hidden flex flex-col">
          {/* Status bar */}
          <div className="hidden md:flex justify-between items-center px-7 pt-3 pb-1 text-[15px] font-semibold text-welmi-ink z-30">
            <div className="flex items-center gap-1.5">
              <span>05:23</span>
              <svg width="18" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2 18v-6h20v6M2 18h20M2 12V8a2 2 0 0 1 2-2h6v6M14 6h6a2 2 0 0 1 2 2v4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex items-end gap-[2px]">
                <span className="w-[3px] h-[5px] bg-welmi-ink rounded-sm" />
                <span className="w-[3px] h-[7px] bg-welmi-ink rounded-sm" />
                <span className="w-[3px] h-[9px] bg-welmi-ink rounded-sm" />
                <span className="w-[3px] h-[11px] bg-welmi-ink rounded-sm" />
              </span>
              <span className="text-[14px]">5G</span>
              <span className="relative inline-block w-[26px] h-[12px] border border-welmi-ink rounded-[3px]">
                <span className="absolute inset-[1px] bg-welmi-ink rounded-[1.5px]" />
                <span className="absolute -right-[3px] top-[3px] w-[2px] h-[6px] bg-welmi-ink rounded-r" />
              </span>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
