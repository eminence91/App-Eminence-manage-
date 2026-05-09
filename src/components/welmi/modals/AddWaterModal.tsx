"use client";

import { useState } from "react";
import { useWelmi } from "../store";
import { Sheet } from "./Sheet";
import { IconDrop } from "../icons";

export function AddWaterModal() {
  const { modal, closeModal, dispatch } = useWelmi();
  const [amount, setAmount] = useState(250);
  const open = modal === "addWater";

  return (
    <Sheet open={open} onClose={closeModal} title="Ajouter de l'eau">
      <div className="flex flex-col items-center pt-4">
        <IconDrop size={80} className="text-welmi-sky" />
        <div className="text-4xl font-extrabold text-welmi-ink mt-3">{amount} ml</div>
        <input
          type="range"
          min={50}
          max={1000}
          step={50}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full mt-6 accent-welmi-sky"
        />
        <div className="flex gap-2 mt-5">
          {[150, 250, 500, 750].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                amount === v ? "bg-welmi-sky text-white" : "bg-white shadow-card text-welmi-ink"
              }`}
            >
              {v} ml
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            dispatch({ type: "addWater", ml: amount });
            closeModal();
          }}
          className="mt-8 w-full py-3.5 rounded-full bg-welmi-coral text-white font-bold shadow-[0_4px_14px_rgba(247,86,96,0.35)]"
        >
          Ajouter
        </button>
      </div>
    </Sheet>
  );
}

export function AddWeightModal() {
  const { modal, closeModal, dispatch, state } = useWelmi();
  const [v, setV] = useState(state.weight ?? 75);
  const open = modal === "addWeight";

  return (
    <Sheet open={open} onClose={closeModal} title="Ajouter votre poids">
      <div className="flex flex-col items-center pt-6">
        <div className="text-5xl font-extrabold text-welmi-ink">
          {v.toFixed(1)} <span className="text-2xl text-welmi-gray font-bold">kg</span>
        </div>
        <input
          type="range"
          min={40}
          max={150}
          step={0.1}
          value={v}
          onChange={(e) => setV(Number(e.target.value))}
          className="w-full mt-8 accent-welmi-coral"
        />
        <button
          onClick={() => {
            dispatch({ type: "setWeight", kg: Number(v.toFixed(1)) });
            closeModal();
          }}
          className="mt-8 w-full py-3.5 rounded-full bg-welmi-coral text-white font-bold shadow-[0_4px_14px_rgba(247,86,96,0.35)]"
        >
          Enregistrer
        </button>
      </div>
    </Sheet>
  );
}
