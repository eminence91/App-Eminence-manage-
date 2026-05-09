"use client";

import type { ReactNode } from "react";
import { IconClose } from "../icons";

export function Sheet({
  open,
  onClose,
  title,
  children,
  variant = "sheet",
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  variant?: "sheet" | "full";
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40 flex items-end md:rounded-[34px] overflow-hidden">
      <button
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px] animate-[fadeIn_.2s_ease]"
      />
      <div
        className={`relative w-full ${
          variant === "full" ? "h-[94%]" : "max-h-[88%]"
        } bg-welmi-bg rounded-t-[28px] shadow-[0_-12px_40px_rgba(0,0,0,0.18)] animate-[slideUp_.25s_ease] overflow-hidden flex flex-col`}
      >
        <div className="flex items-start justify-between px-5 pt-5">
          <div className="flex-1 pr-2">{typeof title === "string" ? <h2 className="text-[28px] font-bold text-welmi-ink">{title}</h2> : title}</div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white shadow-card flex items-center justify-center text-welmi-ink"
          >
            <IconClose size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pt-3 pb-8">{children}</div>
      </div>
    </div>
  );
}

export function Popover({
  open,
  onClose,
  children,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40">
      <button aria-label="Fermer" onClick={onClose} className="absolute inset-0 bg-black/20" />
      <div
        className={`absolute bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
