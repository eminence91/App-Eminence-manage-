"use client";

import { useState } from "react";
import { useWelmi } from "../store";
import { Sheet } from "./Sheet";
import { IconSend } from "../icons";

const SUGGESTIONS = [
  "Que manger après une séance d'abs ?",
  "Combien de calories pour perdre 2 kg ?",
  "Une recette riche en protéines ?",
  "Programme de marche pour la semaine ?",
];

export function RicardoModal() {
  const { modal, closeModal } = useWelmi();
  const [messages, setMessages] = useState<{ from: "you" | "ric"; text: string }[]>([
    { from: "ric", text: "Bonjour ! Je suis Ricardo, votre coach. Comment puis-je vous aider aujourd'hui ?" },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: "you", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: "ric",
          text:
            "Excellente question ! Pour rester sur votre objectif, je vous suggère un repas équilibré (protéines + légumes + glucides complexes) et 500 ml d'eau. Voulez-vous que je crée une recette ?",
        },
      ]);
    }, 600);
  };

  return (
    <Sheet open={modal === "ricardo"} onClose={closeModal} variant="full" title="Ricardo">
      <div className="flex flex-col h-full">
        <div className="flex-1 space-y-2 pb-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[15px] ${
                m.from === "you"
                  ? "bg-welmi-coral text-white ml-auto rounded-br-sm"
                  : "bg-white text-welmi-ink shadow-card rounded-bl-sm"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 py-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="px-3 py-1.5 rounded-full bg-white shadow-card text-sm text-welmi-ink"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="sticky bottom-0 bg-welmi-bg pt-2 pb-2 flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez une question…"
            className="flex-1 px-4 py-3 rounded-full bg-white shadow-card outline-none text-welmi-ink placeholder:text-welmi-gray-soft"
          />
          <button
            type="submit"
            className="w-12 h-12 rounded-full bg-welmi-coral text-white flex items-center justify-center"
          >
            <IconSend size={20} />
          </button>
        </form>
      </div>
    </Sheet>
  );
}
