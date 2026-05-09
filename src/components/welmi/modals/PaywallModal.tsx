"use client";

import { useWelmi } from "../store";
import { IconClose } from "../icons";

const HERO_BG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 600'>
    <defs>
      <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
        <stop offset='0' stop-color='#D9C6B0'/>
        <stop offset='1' stop-color='#9C7A5E'/>
      </linearGradient>
    </defs>
    <rect width='400' height='600' fill='url(#g)'/>
    <ellipse cx='200' cy='220' rx='110' ry='40' fill='#1a1a1a' opacity='0.7'/>
    <rect x='110' y='250' width='180' height='240' rx='30' fill='#2a2a2a'/>
    <rect x='80' y='320' width='240' height='40' fill='#5AB7FF' opacity='0.8' rx='4'/>
  </svg>`);

export function PaywallModal() {
  const { modal, closeModal } = useWelmi();
  if (modal !== "paywall") return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white">
      <div className="relative flex-1 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_BG} alt="Body scan illustration" className="w-full h-full object-cover" />
        <button
          onClick={closeModal}
          className="absolute top-5 left-5 w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white"
        >
          <IconClose size={20} />
        </button>
        <div className="absolute top-12 right-5 bg-white/85 backdrop-blur rounded-2xl px-3 py-2 shadow-card">
          <div className="text-[11px] text-welmi-gray">Masse maigre</div>
          <div className="text-[17px] font-extrabold text-welmi-ink leading-none mt-0.5">Optimal</div>
          <div className="mt-2 flex h-1.5 rounded-full overflow-hidden">
            <span className="flex-1 bg-welmi-sky" />
            <span className="w-3 h-3 -my-1 rounded-full bg-white border-2 border-welmi-sky" />
            <span className="flex-1 bg-welmi-mint" />
            <span className="flex-1 bg-orange-400" />
          </div>
        </div>
        <div className="absolute bottom-32 left-5 bg-white/85 backdrop-blur rounded-2xl px-3 py-2 shadow-card">
          <div className="text-[11px] text-welmi-gray">Graisse corporelle</div>
          <div className="text-[17px] font-extrabold text-welmi-ink leading-none mt-0.5">Bon</div>
          <div className="mt-2 flex h-1.5 rounded-full overflow-hidden items-center">
            <span className="flex-1 bg-welmi-sky" />
            <span className="flex-1 bg-welmi-mint" />
            <span className="w-3 h-3 -my-1 rounded-full bg-white border-2 border-welmi-mint" />
            <span className="flex-1 bg-orange-400" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[28px] px-5 pt-6 pb-8 shadow-[0_-12px_40px_rgba(0,0,0,0.18)]">
        <h2 className="text-center text-[26px] font-extrabold text-welmi-ink leading-tight">
          Voyez tout avec le body scan IA &amp; rapport bien-être
        </h2>
        <div className="mt-5 rounded-2xl bg-gradient-to-b from-rose-50 to-white p-4 text-center">
          <div className="text-welmi-ink font-semibold">Accès à vie</div>
          <div className="text-welmi-ink mt-1">
            <span className="font-bold">24,99 €</span> · paiement unique
          </div>
        </div>
        <button className="mt-4 w-full py-4 rounded-full bg-welmi-coral text-white text-[17px] font-bold shadow-[0_8px_24px_rgba(247,86,96,0.35)]">
          Continuer
        </button>
        <p className="mt-3 text-center text-xs text-welmi-gray-soft leading-snug">
          Il s&apos;agit d&apos;une option supplémentaire proposée moyennant des frais additionnels. Cet
          achat est facultatif&nbsp;: votre abonnement n&apos;en dépend pas.
        </p>
        <div className="mt-3 flex items-center justify-between text-sm text-welmi-gray-soft">
          <button>Conditions</button>
          <button>Confidentialité</button>
          <button>Restaurer</button>
        </div>
      </div>
    </div>
  );
}
