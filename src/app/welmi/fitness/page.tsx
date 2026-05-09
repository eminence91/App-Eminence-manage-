"use client";

import { useWelmi } from "@/components/welmi/store";
import { TopBar } from "@/components/welmi/TopBar";
import { RicardoBar } from "@/components/welmi/Ricardo";
import { IconArrowRight, IconBolt, IconChevronRight, IconDumbbell, IconShoe } from "@/components/welmi/icons";

const WEEK = [
  { d: "lun.", n: 4 },
  { d: "mar.", n: 5 },
  { d: "mer.", n: 6 },
  { d: "jeu.", n: 7 },
  { d: "ven.", n: 8 },
  { d: "sam.", n: 9, today: true },
  { d: "dim.", n: 10 },
];

const EXERCISES = [
  "linear-gradient(135deg,#0e3b2a,#a55c3b)",
  "linear-gradient(135deg,#0a3c5a,#a55c3b)",
  "linear-gradient(135deg,#13301f,#a55c3b)",
  "linear-gradient(135deg,#0d3a2a,#222)",
  "linear-gradient(135deg,#163a23,#9a512e)",
];

export default function FitnessPage() {
  const { state } = useWelmi();

  return (
    <>
      <TopBar />
      <div className="px-5 pb-6 space-y-4">
        {/* Hero week plan */}
        <section className="rounded-3xl p-5 text-white bg-gradient-to-b from-[#FF7682] via-[#E07AA8] to-[#7E6BE0] shadow-[0_8px_30px_rgba(126,107,224,0.35)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <span className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-[10px]">📅</span>
              Semaine 1
            </div>
            <button className="flex items-center gap-1 text-[15px] font-medium opacity-90">
              Voir le plan <IconChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-7 mt-4 gap-1 text-center">
            {WEEK.map((w) => (
              <div key={w.d} className="flex flex-col items-center gap-2">
                <span className="text-[12px] opacity-90">{w.d}</span>
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-[15px] font-semibold ${
                    w.today ? "bg-white/25 ring-2 ring-white/60" : ""
                  }`}
                >
                  {w.n === 8 ? (
                    <span>{w.n}</span>
                  ) : (
                    <IconDumbbell size={18} className="opacity-95" />
                  )}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[15px] mt-5 leading-snug opacity-95">
            Terminez vos entraînements pour gagner en force et progresser plus vite
          </p>

          <div className="mt-4 flex items-center justify-between px-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                  <IconDumbbell size={14} className="text-white/85" />
                </span>
                {i < 4 && <span className="w-10 h-[3px] bg-white/15 mx-1" />}
              </div>
            ))}
          </div>

          {/* Workout card */}
          <button className="mt-4 w-full text-left bg-white/15 rounded-2xl p-4 backdrop-blur">
            <div className="text-[28px] font-extrabold leading-none">27 min</div>
            <div className="text-[15px] opacity-95 mt-1">Abs, Retour</div>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {EXERCISES.slice(0, 5).map((bg, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl"
                  style={{ background: bg }}
                />
              ))}
            </div>
            <div className="mt-3 flex justify-end">
              <span className="w-11 h-11 rounded-xl bg-white/85 backdrop-blur flex items-center justify-center text-welmi-ink shadow">
                <IconArrowRight size={20} />
              </span>
            </div>
          </button>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-3">
          <Stat
            label="PAS"
            value={state.steps}
            goal={state.stepsGoal}
            unit=""
            color="bg-welmi-gray-line"
            barColor="bg-welmi-violet"
            icon={<IconShoe size={16} className="text-welmi-gray" />}
            chevron
          />
          <Stat
            label="BRÛLÉES"
            value={0}
            goal={state.caloriesBurnedGoal}
            unit="kcal"
            color="bg-welmi-gray-line"
            barColor="bg-welmi-coral"
            icon={<IconBolt size={16} className="text-welmi-gray" />}
          />
        </section>

        {/* Activity */}
        <section className="bg-white rounded-2xl p-4 shadow-card">
          <div className="text-xs font-semibold tracking-wider text-welmi-gray uppercase">Activités</div>
          <div className="mt-3 bg-welmi-bg rounded-2xl px-3 py-3 flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div className="flex-1 space-y-1.5">
              <div className="h-2 rounded bg-welmi-gray-line w-2/3" />
              <div className="h-2 rounded bg-welmi-gray-line w-1/2" />
            </div>
          </div>
          <p className="text-center text-welmi-gray text-sm mt-4">
            Appuyez sur «&nbsp;+&nbsp;» pour ajouter votre première activité de la journée
          </p>
        </section>
      </div>

      <RicardoBar />
    </>
  );
}

function Stat({
  label,
  value,
  goal,
  unit,
  icon,
  barColor,
  chevron,
}: {
  label: string;
  value: number;
  goal: number;
  unit: string;
  color: string;
  barColor: string;
  icon: React.ReactNode;
  chevron?: boolean;
}) {
  const pct = goal > 0 ? Math.min(1, value / goal) : 0;
  return (
    <div className="bg-white rounded-2xl p-4 shadow-card">
      <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-welmi-gray">
        <div className="flex items-center gap-1.5">
          {icon}
          <span>{label}</span>
        </div>
        {chevron && <IconChevronRight size={14} className="text-welmi-gray-soft" />}
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-[34px] font-extrabold text-welmi-ink leading-none">{value}</span>
        <span className="text-welmi-gray text-sm">/ {goal} {unit}</span>
      </div>
      <div className="mt-3 h-1 rounded-full bg-welmi-gray-line/70 overflow-hidden">
        <div className={`h-full ${barColor}`} style={{ width: `${pct * 100}%` }} />
      </div>
    </div>
  );
}
