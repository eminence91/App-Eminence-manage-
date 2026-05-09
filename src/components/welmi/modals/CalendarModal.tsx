"use client";

import { useState } from "react";
import { useWelmi } from "../store";
import { Popover } from "./Sheet";
import { IconChevronLeft, IconChevronRight } from "../icons";

const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const DAYS_SHORT = ["LUN.", "MAR.", "MER.", "JEU.", "VEN.", "SAM.", "DIM."];

export function CalendarModal() {
  const { modal, closeModal, state, dispatch } = useWelmi();
  const [view, setView] = useState(() => new Date(state.selectedDate));
  if (modal !== "calendar") return null;

  const year = view.getFullYear();
  const month = view.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  // monday-first index
  const startCol = (first.getDay() + 6) % 7;
  const cells: (number | null)[] = [];
  for (let i = 0; i < startCol; i++) cells.push(null);
  for (let d = 1; d <= last.getDate(); d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const sel = state.selectedDate;
  const selSame = sel.getFullYear() === year && sel.getMonth() === month;

  return (
    <Popover open onClose={closeModal} className="left-4 top-[60px] right-[120px] p-5">
      <div className="flex items-center justify-between mb-4">
        <button className="flex items-center gap-1 text-welmi-ink font-bold text-[17px]">
          {MONTHS[month].charAt(0).toUpperCase() + MONTHS[month].slice(1)} {year}
          <IconChevronRight size={18} className="text-welmi-coral" />
        </button>
        <div className="flex items-center gap-3 text-welmi-gray-soft">
          <button onClick={() => setView(new Date(year, month - 1, 1))} className="p-1">
            <IconChevronLeft size={20} />
          </button>
          <button onClick={() => setView(new Date(year, month + 1, 1))} className="p-1">
            <IconChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-welmi-gray-soft mb-1">
        {DAYS_SHORT.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d == null) return <div key={i} />;
          const isSel = selSame && sel.getDate() === d;
          return (
            <button
              key={i}
              onClick={() => {
                dispatch({ type: "setDate", date: new Date(year, month, d) });
                closeModal();
              }}
              className={`h-10 rounded-full text-[15px] font-semibold flex items-center justify-center transition-colors ${
                isSel
                  ? "bg-welmi-coral text-white"
                  : "text-welmi-ink hover:bg-welmi-gray-line/60"
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </Popover>
  );
}
