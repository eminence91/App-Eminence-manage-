"use client";

import { useWelmi } from "./store";
import { IconCalendar, IconDrop, IconUser } from "./icons";

const FR_DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const FR_MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

export function TopBar() {
  const { state, openModal } = useWelmi();
  const d = state.selectedDate;
  const day = FR_DAYS[d.getDay()];
  const dayLabel = day.charAt(0).toUpperCase() + day.slice(1);
  const dateLabel = `${dayLabel} ${d.getDate()} ${FR_MONTHS[d.getMonth()]}`;

  return (
    <div className="px-5 pt-3 pb-2 flex items-center justify-between bg-welmi-bg">
      <button
        onClick={() => openModal("calendar")}
        className="flex items-center gap-3 active:scale-95 transition-transform"
      >
        <span className="w-12 h-12 rounded-full bg-white shadow-card flex items-center justify-center text-welmi-ink">
          <IconCalendar size={22} />
        </span>
        <span className="text-left">
          <span className="block text-[22px] font-bold text-welmi-ink leading-none">Aujourd&apos;hui</span>
          <span className="block text-sm text-welmi-gray mt-1">{dateLabel}</span>
        </span>
      </button>
      <div className="flex items-center gap-3">
        <button
          onClick={() => openModal("streak")}
          className="h-11 px-3 rounded-full bg-white shadow-card flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <IconDrop size={18} className="text-welmi-gray-soft" />
          <span className="text-[15px] font-bold text-welmi-ink">{state.streak}</span>
        </button>
        <button
          onClick={() => openModal("profil")}
          className="w-11 h-11 rounded-full bg-white shadow-card flex items-center justify-center active:scale-95 transition-transform"
        >
          <IconUser size={20} className="text-welmi-ink" />
        </button>
      </div>
    </div>
  );
}
