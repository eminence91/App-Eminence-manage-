"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import AddMenu from "./AddMenu";

interface FABProps {
  className?: string;
}

export default function FAB({ className = "" }: FABProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  return (
    <div className={`fixed bottom-20 right-4 z-40 lg:hidden ${className}`}>
      {showAddMenu && (
        <div className="absolute bottom-14 right-0">
          <AddMenu onClose={() => setShowAddMenu(false)} />
        </div>
      )}
      <button
        onClick={() => setShowAddMenu(!showAddMenu)}
        className={`w-14 h-14 rounded-full bg-success hover:bg-success/90 text-white shadow-lg hover:shadow-xl
          flex items-center justify-center transition-all duration-200 active:scale-95
          ${showAddMenu ? "rotate-45" : "rotate-0"}`}
        aria-label="Ajouter"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>
    </div>
  );
}
