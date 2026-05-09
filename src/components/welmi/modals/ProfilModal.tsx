"use client";

import { useWelmi } from "../store";
import { Sheet } from "./Sheet";
import {
  IconHeadphones,
  IconGrid,
  IconClock,
  IconFlame,
  IconWalk,
  IconRuler,
  IconDrop,
  IconUser,
  IconCalendar,
  IconBody,
  IconGlobe,
} from "../icons";

function Row({
  icon,
  bg,
  label,
  value,
  toggle,
  toggled,
  onToggle,
  onClick,
  textColor = "text-welmi-ink",
}: {
  icon: React.ReactNode;
  bg: string;
  label: string;
  value?: string;
  toggle?: boolean;
  toggled?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
  textColor?: string;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 py-3 cursor-pointer"
    >
      <span className={`w-9 h-9 rounded-[10px] flex items-center justify-center text-white ${bg}`}>
        {icon}
      </span>
      <span className={`flex-1 font-semibold ${textColor}`}>{label}</span>
      {toggle ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
          className={`w-12 h-7 rounded-full p-0.5 transition-colors ${
            toggled ? "bg-welmi-coral" : "bg-welmi-gray-line"
          }`}
        >
          <span
            className={`block w-6 h-6 rounded-full bg-white shadow transition-transform ${
              toggled ? "translate-x-5" : ""
            }`}
          />
        </button>
      ) : (
        <span className="text-welmi-gray font-medium flex items-center gap-1">
          {value}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
        </span>
      )}
    </div>
  );
}

function RowDescribed({
  icon,
  bg,
  label,
  desc,
  toggled,
  onToggle,
}: {
  icon: React.ReactNode;
  bg: string;
  label: string;
  desc: string;
  toggled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className={`w-10 h-10 rounded-[10px] flex items-center justify-center text-white ${bg}`}>
        {icon}
      </span>
      <div className="flex-1">
        <div className="font-bold text-welmi-ink">{label}</div>
        <div className="text-sm text-welmi-gray leading-snug mt-0.5">{desc}</div>
      </div>
      <button
        onClick={onToggle}
        className={`mt-1 w-12 h-7 rounded-full p-0.5 transition-colors ${
          toggled ? "bg-welmi-coral" : "bg-welmi-gray-line"
        }`}
      >
        <span
          className={`block w-6 h-6 rounded-full bg-white shadow transition-transform ${
            toggled ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}

export function ProfilModal() {
  const { modal, closeModal, state, dispatch } = useWelmi();
  const open = modal === "profil";

  return (
    <Sheet open={open} onClose={closeModal} variant="full" title="Profil">
      <div className="bg-white rounded-2xl px-4 mt-2 shadow-card">
        <Row
          icon={<IconHeadphones size={18} />}
          bg="bg-welmi-sky-dark"
          label="Support client"
          onClick={() => {
            closeModal();
            setTimeout(() => {
              const ev = new CustomEvent("welmi:open-support");
              window.dispatchEvent(ev);
            }, 150);
          }}
        />
      </div>

      <div className="bg-white rounded-2xl px-4 mt-4 shadow-card divide-y divide-welmi-gray-line/70">
        <RowDescribed
          icon={<IconGrid size={18} />}
          bg="bg-welmi-violet-light"
          label="Widget de l'écran d'accueil"
          desc="Affichez vos calories quotidiennes et vos macros sur votre écran d'accueil"
          toggled={state.homeWidget}
          onToggle={() => dispatch({ type: "toggleHomeWidget" })}
        />
        <RowDescribed
          icon={<IconClock size={18} />}
          bg="bg-welmi-mint"
          label="Activité en direct"
          desc="Affichez vos calories quotidiennes et vos macros sur votre écran de verrouillage et votre îlot dynamique"
          toggled={state.liveActivity}
          onToggle={() => dispatch({ type: "toggleLiveActivity" })}
        />
      </div>

      <div className="bg-white rounded-2xl px-4 mt-4 shadow-card divide-y divide-welmi-gray-line/70">
        <Row icon={<IconFlame size={18} />} bg="bg-welmi-coral" label="Calories et macros" />
        <Row icon={<IconWalk size={18} />} bg="bg-welmi-violet-light" label="Pas" value={`${state.stepsGoal} pas`} />
        <Row icon={<IconRuler size={18} />} bg="bg-pink-400" label="Système de mesure" value={state.profile.measurement} />
        <Row icon={<IconDrop size={18} />} bg="bg-welmi-sky" label="Hydratation" value={`${state.waterGoal} ml`} />
      </div>

      <div className="bg-white rounded-2xl px-4 mt-4 shadow-card divide-y divide-welmi-gray-line/70">
        <Row icon={<IconUser size={18} />} bg="bg-welmi-sky-dark" label="Sexe" value={state.profile.sex} />
        <Row icon={<IconCalendar size={18} />} bg="bg-welmi-coral" label="Âge" value={`${state.profile.age}`} />
        <Row icon={<IconBody size={18} />} bg="bg-orange-400" label="Taille" value={`${state.profile.height} cm`} />
        <Row icon={<IconGlobe size={18} />} bg="bg-welmi-violet-light" label="Langue" value={state.profile.language} />
      </div>

      <div className="bg-white rounded-2xl px-4 mt-4 mb-6 shadow-card">
        <div className="py-3 text-center font-bold text-welmi-coral">Supprimer le compte</div>
      </div>
    </Sheet>
  );
}
