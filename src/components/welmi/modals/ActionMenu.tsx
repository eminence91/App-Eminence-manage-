"use client";

import { useRouter } from "next/navigation";
import { useWelmi } from "../store";
import {
  IconHeart,
  IconBody,
  IconScale,
  IconRun,
  IconWalk,
  IconStar,
  IconSearch,
  IconMic,
  IconScan,
  IconClose,
} from "../icons";

const items = [
  { label: "Évaluation santé", Icon: IconHeart, action: "wellness" },
  { label: "Scan corporel", Icon: IconBody, action: "scan" },
  { label: "Ajouter poids", Icon: IconScale, action: "weight" },
  { label: "Enregistrer entraînements", Icon: IconRun, action: "workout" },
  { label: "Commencer à marcher", Icon: IconWalk, action: "walk" },
  { label: "Favoris", Icon: IconStar, action: "favs" },
  { label: "Recherche", Icon: IconSearch, action: "search" },
  { label: "Décrire", Icon: IconMic, action: "describe" },
  { label: "Scanner", Icon: IconScan, action: "barcode" },
] as const;

export function ActionMenu() {
  const { modal, closeModal, openModal, dispatch } = useWelmi();
  const router = useRouter();
  if (modal !== "action") return null;

  const handle = (a: (typeof items)[number]["action"]) => {
    closeModal();
    setTimeout(() => {
      switch (a) {
        case "scan":
        case "wellness":
          openModal("paywall");
          break;
        case "weight":
          openModal("addWeight");
          break;
        case "walk":
          dispatch({ type: "addSteps", n: 1500 });
          router.push("/welmi/fitness");
          break;
        case "workout":
          router.push("/welmi/fitness");
          break;
        default:
          break;
      }
    }, 150);
  };

  return (
    <div className="absolute inset-0 z-50">
      <button
        aria-label="Fermer"
        onClick={closeModal}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <div className="absolute right-4 bottom-5 flex flex-col items-end gap-3 animate-[slideUp_.25s_ease]">
        {items.map(({ label, Icon, action }) => (
          <button
            key={label}
            onClick={() => handle(action)}
            className="flex items-center gap-3"
          >
            <span className="text-white text-[17px] font-semibold drop-shadow">{label}</span>
            <span className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/30 flex items-center justify-center text-white">
              <Icon size={22} />
            </span>
          </button>
        ))}
        <button
          onClick={closeModal}
          className="w-14 h-14 rounded-full bg-welmi-coral text-white flex items-center justify-center shadow-[0_8px_24px_rgba(247,86,96,0.45)] mt-2"
        >
          <IconClose size={26} />
        </button>
      </div>
    </div>
  );
}
