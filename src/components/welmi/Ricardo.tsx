"use client";

import { useState } from "react";
import { useWelmi } from "./store";
import { IconChevronRight } from "./icons";

const AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
      <defs>
        <linearGradient id='g' x1='0' x2='0' y1='0' y2='1'>
          <stop offset='0' stop-color='#E5E7EB'/>
          <stop offset='1' stop-color='#9CA3AF'/>
        </linearGradient>
      </defs>
      <rect width='64' height='64' rx='32' fill='url(#g)'/>
      <circle cx='32' cy='26' r='10' fill='#1f2937'/>
      <path d='M12 60c4-12 14-16 20-16s16 4 20 16z' fill='#1f2937'/>
    </svg>`
  );

export function RicardoBar() {
  const { openModal } = useWelmi();
  return (
    <button
      onClick={() => openModal("ricardo")}
      className="absolute bottom-0 left-0 right-0 mx-4 mb-[88px] z-10 flex items-center gap-3 px-3 py-2 bg-white/80 backdrop-blur rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
    >
      <span className="relative inline-block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={AVATAR} alt="Ricardo" className="w-8 h-8 rounded-full" />
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-gradient-to-br from-welmi-coral to-welmi-violet ring-2 ring-white" />
      </span>
      <span className="text-sm font-semibold text-welmi-ink">Ricardo est là pour aider</span>
    </button>
  );
}

export function RicardoCard() {
  const [retried, setRetried] = useState(false);
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      <div className="flex items-center gap-3 mb-3">
        <span className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={AVATAR} alt="Ricardo" className="w-9 h-9 rounded-full" />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-gradient-to-br from-welmi-coral to-welmi-violet ring-2 ring-white" />
        </span>
        <span className="font-bold text-welmi-ink">Ricardo est là pour aider</span>
      </div>
      <p className="text-center text-welmi-gray text-[15px] mb-4">
        {retried
          ? "Connexion rétablie ! Posez-moi une question."
          : "URLSessionTask failed with error: La connexion réseau a été perdue."}
      </p>
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={() => setRetried(true)}
          className="px-7 py-2.5 rounded-full bg-welmi-coral text-white font-semibold shadow-[0_4px_14px_rgba(247,86,96,0.35)]"
        >
          Réessayer
        </button>
        <button className="flex items-center gap-1 text-welmi-gray text-sm">
          Demander autre chose <IconChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
