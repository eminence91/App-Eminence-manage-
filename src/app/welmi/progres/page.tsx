"use client";

import { useWelmi } from "@/components/welmi/store";
import { TopBar } from "@/components/welmi/TopBar";
import { RicardoBar } from "@/components/welmi/Ricardo";
import { IconBody, IconHeart, IconScale } from "@/components/welmi/icons";

export default function ProgresPage() {
  const { state, openModal } = useWelmi();

  return (
    <>
      <TopBar />
      <div className="px-5 pb-6 space-y-4">
        <section className="bg-white rounded-2xl p-4 shadow-card flex items-center justify-between">
          <div className="flex items-center gap-2 text-welmi-gray-soft">
            <IconScale size={20} />
            <span className="font-semibold">Poids</span>
            {state.weight && (
              <span className="ml-2 text-welmi-ink font-bold text-lg">
                {state.weight.toFixed(1)} kg
              </span>
            )}
          </div>
          <button
            onClick={() => openModal("addWeight")}
            className="px-5 py-3 rounded-full bg-welmi-coral text-white font-semibold shadow-[0_4px_14px_rgba(247,86,96,0.35)]"
          >
            Ajouter poids
          </button>
        </section>

        <button
          onClick={() => openModal("paywall")}
          className="block text-left w-full rounded-2xl overflow-hidden text-white relative shadow-card"
          style={{
            background:
              "linear-gradient(135deg,#7E6BE0 0%,#5B6CE0 50%,#2B59C8 100%)",
          }}
        >
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-90" style={{
            background:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 260'><defs><radialGradient id='g'><stop offset='0' stop-color='%23ffffff' stop-opacity='.4'/><stop offset='1' stop-color='%23ffffff' stop-opacity='0'/></radialGradient></defs><rect width='200' height='260' fill='%237E6BE0'/><ellipse cx='110' cy='160' rx='100' ry='40' fill='url(%23g)'/><rect x='70' y='40' width='60' height='90' rx='30' fill='%231f2937' opacity='.8'/><rect x='80' y='130' width='50' height='110' rx='8' fill='%231a1a1a' opacity='.85'/><circle cx='105' cy='160' r='90' fill='none' stroke='white' stroke-width='1.5' opacity='.45'/><circle cx='105' cy='180' r='80' fill='none' stroke='white' stroke-width='1.5' opacity='.4'/></svg>\") center/cover",
          }} />
          <div className="relative p-5">
            <div className="flex items-center gap-2 font-semibold">
              <IconBody size={18} />
              Scan corporel
            </div>
            <p className="mt-3 font-extrabold text-[20px] leading-snug max-w-[60%]">
              Il est plus facile de se mettre en forme quand on connaît son corps
            </p>
            <span className="mt-4 inline-block px-5 py-2.5 rounded-full bg-white text-welmi-ink font-semibold">
              Scanner du corps
            </span>
          </div>
        </button>

        <button
          onClick={() => openModal("paywall")}
          className="block text-left w-full rounded-2xl overflow-hidden text-white relative shadow-card"
          style={{
            background:
              "linear-gradient(135deg,#5AB7FF 0%,#3B8FE0 50%,#1E6AC2 100%)",
          }}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-1/2 opacity-90"
            style={{
              background:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 260'><rect width='200' height='260' fill='%235AB7FF'/><circle cx='100' cy='90' r='40' fill='%23F2D6B5'/><path d='M40 230c0-50 30-90 60-90s60 40 60 90H40z' fill='white'/><path d='M50 80c10-30 35-50 50-50s40 20 50 50c-10-5-30-10-50-10s-40 5-50 10z' fill='%234A2C20'/></svg>\") center/cover",
            }}
          />
          <div className="relative p-5">
            <div className="flex items-center gap-2 font-semibold">
              <IconHeart size={16} />
              Rapport sur le bien-être
            </div>
            <p className="mt-3 font-extrabold text-[20px] leading-snug max-w-[60%]">
              Examinez vos habitudes et les points sur lesquels vous devez vous concentrer
            </p>
            <span className="mt-4 inline-block px-5 py-2.5 rounded-full bg-white text-welmi-ink font-semibold">
              Obtenir le rapport
            </span>
          </div>
        </button>
      </div>
      <RicardoBar />
    </>
  );
}
