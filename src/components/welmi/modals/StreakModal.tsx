"use client";

import { useWelmi } from "../store";
import { Sheet } from "./Sheet";
import { IconDrop } from "../icons";

const DAYS = ["L", "M", "M", "J", "V", "S", "D"];

const RICARDO_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
      <rect width='64' height='64' rx='32' fill='#E5E7EB'/>
      <circle cx='32' cy='26' r='10' fill='#1f2937'/>
      <path d='M12 60c4-12 14-16 20-16s16 4 20 16z' fill='#1f2937'/>
    </svg>`
  );

export function StreakModal() {
  const { modal, closeModal, state } = useWelmi();
  const open = modal === "streak";
  return (
    <Sheet open={open} onClose={closeModal} variant="full" title={<span />}>
      <div className="flex flex-col items-center pt-6">
        <IconDrop size={130} className="text-welmi-gray-line" />
        <div className="mt-2 text-[80px] font-extrabold text-welmi-ink leading-none">
          {state.streak}
        </div>
        <div className="text-xl font-bold text-welmi-ink mt-2">série de jours</div>
        <div className="grid grid-cols-7 gap-3 mt-8 w-full max-w-[320px]">
          {DAYS.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-sm font-semibold text-welmi-gray">{d}</span>
              <span
                className={`w-9 h-9 rounded-full ${
                  state.weekDone[i] ? "bg-welmi-gray-line" : "bg-welmi-gray-line/60"
                }`}
              />
            </div>
          ))}
        </div>
        <div className="mt-8 w-full bg-white rounded-2xl shadow-card p-3 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={RICARDO_AVATAR} alt="Ricardo" className="w-10 h-10 rounded-full" />
          <p className="text-[15px] text-welmi-ink leading-snug">
            Notez vos repas, eau ou activité demain pour garder la série
          </p>
        </div>
      </div>
    </Sheet>
  );
}
