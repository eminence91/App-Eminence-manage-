"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Lightbulb,
  AlertTriangle,
  Phone,
  Calendar,
  ClipboardList,
  Contact,
  PhoneCall,
} from "lucide-react";

interface BottomNavProps {
  className?: string;
  role?: "manager" | "agent";
}

interface NavTab {
  label: string;
  icon: React.ElementType;
  href: string;
  highlight?: boolean;
}

const managerTabs: NavTab[] = [
  { label: "Accueil", icon: Lightbulb, href: "/" },
  { label: "Alertes", icon: AlertTriangle, href: "/alertes" },
  { label: "Appel", icon: Phone, href: "/appel", highlight: true },
];

const agentTabs: NavTab[] = [
  { label: "Mon planning", icon: Calendar, href: "/planning" },
  { label: "Service actif", icon: ClipboardList, href: "/service-actif" },
  { label: "Mes demandes", icon: AlertTriangle, href: "/mes-demandes" },
  { label: "Annuaire", icon: Contact, href: "/annuaire" },
  { label: "Appel urgence", icon: PhoneCall, href: "/appel-urgence", highlight: true },
];

export default function BottomNav({ className = "", role = "manager" }: BottomNavProps) {
  const pathname = usePathname();
  const tabs = role === "agent" ? agentTabs : managerTabs;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-border lg:hidden pb-[env(safe-area-inset-bottom)] ${className}`}
    >
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors
                ${active
                  ? "text-primary-500"
                  : tab.highlight
                    ? "text-success"
                    : "text-muted"
                }`}
            >
              <div
                className={`p-1 rounded-full ${
                  tab.highlight && !active ? "bg-success/10" : ""
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
