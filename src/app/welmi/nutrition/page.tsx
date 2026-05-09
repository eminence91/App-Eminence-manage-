"use client";

import { useEffect, useState } from "react";
import { useWelmi, totals } from "@/components/welmi/store";
import { TopBar } from "@/components/welmi/TopBar";
import { RicardoBar } from "@/components/welmi/Ricardo";
import {
  IconCarrot,
  IconChevronRight,
  IconClock,
  IconDrop,
  IconPlus,
  IconUtensils,
} from "@/components/welmi/icons";

export default function NutritionPage() {
  const { state, openModal } = useWelmi();
  const t = totals(state.meals);
  const remaining = Math.max(0, state.goals.kcal - t.kcal);
  const ringPct = Math.min(1, t.kcal / state.goals.kcal);

  return (
    <>
      <TopBar />
      <div className="px-5 pb-6 space-y-4">
        <KcalCard
          remaining={remaining}
          eaten={t.kcal}
          burned={0}
          carbs={t.carbs}
          protein={t.protein}
          fat={t.fat}
          gCarbs={state.goals.carbs}
          gProt={state.goals.protein}
          gFat={state.goals.fat}
          ringPct={ringPct}
        />

        <MealsCard />

        <WaterCard
          ml={state.water}
          goal={state.waterGoal}
          onAdd={() => openModal("addWater")}
        />

        <FastingCard windowMin={state.fastingWindowMinutes} />

        <PlanRepasCard />
      </div>
      <RicardoBar />
    </>
  );
}

function KcalCard({
  remaining,
  eaten,
  burned,
  carbs,
  protein,
  fat,
  gCarbs,
  gProt,
  gFat,
  ringPct,
}: {
  remaining: number;
  eaten: number;
  burned: number;
  carbs: number;
  protein: number;
  fat: number;
  gCarbs: number;
  gProt: number;
  gFat: number;
  ringPct: number;
}) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - ringPct);
  return (
    <section className="bg-white rounded-2xl p-5 shadow-card">
      <div className="grid grid-cols-3 items-center">
        <div className="text-center">
          <div className="text-3xl font-extrabold text-welmi-ink">{eaten}</div>
          <div className="text-welmi-gray text-sm">Mangées</div>
        </div>
        <div className="relative w-[170px] h-[170px] mx-auto">
          <svg viewBox="0 0 180 180" className="w-full h-full">
            <circle cx="90" cy="90" r={r} stroke="#E5E7EB" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={`${c * 0.75} ${c}`} transform="rotate(135 90 90)" />
            <circle
              cx="90"
              cy="90"
              r={r}
              stroke="#0F1115"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${c * 0.75} ${c}`}
              strokeDashoffset={offset}
              transform="rotate(135 90 90)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[42px] font-extrabold text-welmi-ink leading-none">{remaining}</div>
            <div className="text-welmi-gray text-sm mt-1">kcal restantes</div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-extrabold text-welmi-ink">{burned}</div>
          <div className="text-welmi-gray text-sm">Brûlées</div>
        </div>
      </div>

      <div className="grid grid-cols-3 mt-2 gap-2">
        <Macro label="Glucides" emoji="🌾" color="bg-amber-400" value={carbs} goal={gCarbs} />
        <Macro label="Protéines" emoji="🍗" color="bg-welmi-coral" value={protein} goal={gProt} />
        <Macro label="Graisses" emoji="🫐" color="bg-welmi-sky" value={fat} goal={gFat} />
      </div>
    </section>
  );
}

function Macro({ label, emoji, color, value, goal }: { label: string; emoji: string; color: string; value: number; goal: number }) {
  const pct = goal > 0 ? Math.min(1, value / goal) : 0;
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 text-[13px] text-welmi-gray">
        <span>{emoji}</span>
        <span className="font-medium">{label}</span>
      </div>
      <div className="mx-auto mt-1.5 h-1 rounded-full bg-welmi-gray-line overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct * 100}%` }} />
      </div>
      <div className="text-welmi-gray text-sm mt-1">{value} / {goal}</div>
    </div>
  );
}

const SLOTS = [
  { key: "petit-dejeuner", label: "Petit-déjeuner" },
  { key: "dejeuner", label: "Déjeuner" },
  { key: "diner", label: "Dîner" },
  { key: "collation", label: "Collation" },
] as const;

function MealsCard() {
  const { state, dispatch } = useWelmi();
  const sumFor = (slot: string) =>
    state.meals.filter((m) => m.slot === slot).reduce((a, b) => a + b.kcal, 0);

  const addQuick = (slot: (typeof SLOTS)[number]["key"]) => {
    const presets: Record<typeof slot, { name: string; kcal: number; carbs: number; protein: number; fat: number }> = {
      "petit-dejeuner": { name: "Flocons + fruits", kcal: 380, carbs: 55, protein: 14, fat: 9 },
      dejeuner: { name: "Bowl poulet quinoa", kcal: 620, carbs: 60, protein: 45, fat: 18 },
      diner: { name: "Saumon & légumes", kcal: 540, carbs: 30, protein: 38, fat: 25 },
      collation: { name: "Yaourt + amandes", kcal: 220, carbs: 18, protein: 12, fat: 11 },
    };
    const p = presets[slot];
    dispatch({
      type: "addMeal",
      meal: { id: crypto.randomUUID(), slot, ...p },
    });
  };

  return (
    <section className="bg-white rounded-2xl p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-welmi-ink">
          <IconUtensils size={18} className="text-welmi-coral" />
          Nutrition
        </div>
        <button className="flex items-center gap-1 text-welmi-gray text-sm">
          {state.meals.length === 0 ? "Pas encore de repas" : `${state.meals.length} repas`}
          <IconChevronRight size={14} />
        </button>
      </div>
      <div className="grid grid-cols-4 mt-4 gap-2">
        {SLOTS.map((s) => {
          const k = sumFor(s.key);
          const pct = Math.min(1, k / 600);
          const r = 26;
          const c = 2 * Math.PI * r;
          return (
            <button
              key={s.key}
              onClick={() => addQuick(s.key)}
              className="flex flex-col items-center"
            >
              <div className="relative w-[64px] h-[64px]">
                <svg viewBox="0 0 64 64" className="w-full h-full">
                  <circle cx="32" cy="32" r={r} stroke="#E5E7EB" strokeWidth="4" fill="none" />
                  <circle cx="32" cy="32" r={r} stroke="#0F1115" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform="rotate(-90 32 32)" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-7 h-7 rounded-full bg-welmi-ink text-white flex items-center justify-center">
                    <IconPlus size={16} />
                  </span>
                </span>
              </div>
              <div className="text-[13px] font-semibold text-welmi-ink mt-2">{s.label}</div>
              <div className="text-xs text-welmi-gray">{k} kcal</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function WaterCard({ ml, goal, onAdd }: { ml: number; goal: number; onAdd: () => void }) {
  const cups = 8;
  const cupSize = goal / cups;
  const filled = Math.floor(ml / cupSize);
  return (
    <section className="bg-white rounded-2xl p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-welmi-ink">
          <IconDrop size={18} className="text-welmi-sky" />
          Eau
        </div>
        <IconChevronRight size={16} className="text-welmi-gray-soft" />
      </div>
      <div className="flex items-baseline gap-1 mt-2">
        <span className="text-[32px] font-extrabold text-welmi-ink">{ml}</span>
        <span className="text-welmi-gray text-sm">/ {goal} ml</span>
      </div>
      <div className="grid grid-cols-8 gap-1.5 mt-3">
        {Array.from({ length: cups }).map((_, i) => {
          const isFilled = i < filled;
          if (i === 0 && !isFilled) {
            return (
              <button
                key={i}
                onClick={onAdd}
                className="aspect-[3/4] rounded-md bg-welmi-sky/10 flex items-center justify-center text-welmi-sky"
              >
                <IconPlus size={16} />
              </button>
            );
          }
          return (
            <button
              key={i}
              onClick={onAdd}
              className={`aspect-[3/4] rounded-md ${
                isFilled ? "bg-welmi-sky" : "bg-welmi-sky/15"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}

function fmt(n: number) {
  return n.toString().padStart(2, "0");
}

function FastingCard({ windowMin }: { windowMin: number }) {
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  // counter going down from window
  const totalSec = windowMin * 60;
  const elapsedSec = (now.getSeconds() + now.getMinutes() * 60 + now.getHours() * 3600) % totalSec;
  const remainingSec = totalSec - elapsedSec;
  const h = Math.floor(remainingSec / 3600);
  const m = Math.floor((remainingSec % 3600) / 60);
  const s = remainingSec % 60;
  const pct = elapsedSec / totalSec;

  return (
    <section className="bg-white rounded-2xl p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-welmi-ink">
          <span className="w-5 h-5 rounded-full bg-welmi-violet/80 flex items-center justify-center">
            <IconClock size={12} className="text-white" />
          </span>
          Fenêtre alimentaire
        </div>
        <div className="flex items-center gap-1 text-welmi-gray text-sm">
          12:12 <IconChevronRight size={14} />
        </div>
      </div>
      <div className="mt-2 text-[28px] font-extrabold text-welmi-ink">
        {fmt(h)}:{fmt(m)}:{fmt(s)}
      </div>
      <div className="relative mt-3 h-2.5 rounded-full bg-welmi-gray-line/70">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-welmi-mint"
          style={{ width: `${pct * 100}%` }}
        />
        <span
          className="absolute -top-2 w-7 h-7 rounded-full bg-welmi-mint flex items-center justify-center text-white text-[13px]"
          style={{ left: `calc(${pct * 100}% - 14px)` }}
        >
          🍽
        </span>
        <span className="absolute -top-1.5 right-0 w-5 h-5 rounded-full bg-welmi-gray-line flex items-center justify-center text-welmi-gray text-[11px]">🏁</span>
      </div>
      <p className="text-sm text-welmi-gray mt-3 leading-snug">
        C&apos;est l&apos;heure de manger. Profitez de vos repas avant que la prochaine phase de jeûne ne commence.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button className="py-3 rounded-xl bg-welmi-bg text-welmi-ink font-semibold">Demander</button>
        <button className="py-3 rounded-xl bg-blue-100 text-blue-500 font-semibold">Démarrer</button>
      </div>
    </section>
  );
}

function PlanRepasCard() {
  return (
    <section className="bg-white rounded-2xl p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-welmi-ink">
          <IconCarrot size={18} />
          Plan de repas
        </div>
        <button className="flex items-center gap-1 text-welmi-gray text-sm">
          Voir tout <IconChevronRight size={14} />
        </button>
      </div>
      <div className="text-center text-sm text-welmi-gray mt-6">
        URLSessionTask failed with error: La requête a expiré.
      </div>
      <div className="flex justify-center mt-3">
        <button className="px-7 py-2.5 rounded-full bg-welmi-coral text-white font-semibold shadow-[0_4px_14px_rgba(247,86,96,0.35)]">
          Réessayer
        </button>
      </div>
    </section>
  );
}
