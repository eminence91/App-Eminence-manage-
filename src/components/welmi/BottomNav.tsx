"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWelmi } from "./store";
import { IconApple, IconShoe, IconChart, IconPlus } from "./icons";

const tabs = [
  { href: "/welmi/nutrition", label: "Nutrition", Icon: IconApple },
  { href: "/welmi/fitness", label: "Fitness", Icon: IconShoe },
  { href: "/welmi/progres", label: "Progrès", Icon: IconChart },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { openModal } = useWelmi();

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
      <div className="flex items-end justify-between px-4 pb-5 pointer-events-auto">
        <div className="flex-1 max-w-[300px] bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-around px-2 py-2.5">
          {tabs.map(({ href, label, Icon }) => {
            const active = pathname === href || (href === "/welmi/fitness" && pathname === "/welmi");
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 rounded-full transition-colors ${
                  active ? "bg-welmi-bg" : ""
                }`}
              >
                <Icon size={22} className={active ? "text-welmi-coral" : "text-welmi-ink"} />
                <span
                  className={`text-[11px] font-semibold ${
                    active ? "text-welmi-coral" : "text-welmi-ink"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
        <button
          onClick={() => openModal("action")}
          aria-label="Ajouter"
          className="w-14 h-14 rounded-full bg-welmi-coral text-white flex items-center justify-center shadow-[0_8px_24px_rgba(247,86,96,0.45)] active:scale-95 transition-transform"
        >
          <IconPlus size={28} />
        </button>
      </div>
    </div>
  );
}
