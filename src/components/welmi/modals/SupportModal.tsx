"use client";

import { useEffect, useState } from "react";
import { useWelmi } from "../store";
import { IconClose, IconChat, IconHelp, IconSend, IconSearch } from "../icons";

export function SupportModal() {
  const { modal, openModal, closeModal } = useWelmi();
  const [forced, setForced] = useState(false);

  useEffect(() => {
    const h = () => {
      setForced(true);
      openModal("support");
    };
    window.addEventListener("welmi:open-support", h);
    return () => window.removeEventListener("welmi:open-support", h);
  }, [openModal]);

  const open = modal === "support" || forced;
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 bg-[#117BB8] flex flex-col">
      <div className="flex items-start justify-between px-5 pt-6">
        <div className="flex items-center gap-2">
          <span className="w-12 h-12 rounded-full bg-gradient-to-br from-lime-300 to-emerald-500 flex items-center justify-center text-2xl">
            🌱
          </span>
          <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-extrabold text-welmi-ink">
            <span className="text-[15px]">Wel<span className="text-welmi-coral">mi</span></span>
          </span>
        </div>
        <button
          onClick={() => {
            setForced(false);
            closeModal();
          }}
          className="w-9 h-9 rounded-full bg-white/30 backdrop-blur flex items-center justify-center text-white"
        >
          <IconClose size={18} />
        </button>
      </div>

      <div className="px-6 pt-10">
        <h2 className="text-white text-[34px] font-extrabold leading-tight">
          Bonjour <span aria-label="wave">👋</span>
          <br />
          Comment pouvons-nous vous aider&nbsp;?
        </h2>
      </div>

      <div className="mt-8 px-4 space-y-3">
        <div className="bg-white rounded-2xl shadow-card divide-y divide-welmi-gray-line/70">
          <button className="w-full flex items-center justify-between px-4 py-4">
            <span className="font-bold text-welmi-ink text-[17px]">Conversations</span>
            <IconChat size={22} className="text-[#117BB8]" />
          </button>
          <button className="w-full flex items-center justify-between px-4 py-4">
            <span className="font-bold text-welmi-ink text-[17px]">Aide</span>
            <IconHelp size={22} className="text-[#117BB8]" />
          </button>
        </div>

        <button className="w-full bg-white rounded-2xl shadow-card flex items-center justify-between px-4 py-4">
          <span className="font-bold text-welmi-ink text-[17px]">Envoyez-nous un message</span>
          <IconSend size={20} className="text-[#117BB8]" />
        </button>

        <button className="w-full bg-white rounded-2xl shadow-card flex items-center justify-between px-4 py-4">
          <span className="font-bold text-welmi-ink text-[17px]">Trouver une réponse</span>
          <IconSearch size={20} className="text-[#117BB8]" />
        </button>
      </div>
    </div>
  );
}
