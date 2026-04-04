"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  UserX,
  Building2,
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  Globe,
  MapPin,
  Contact,
  Users,
  BarChart3,
  MessageSquare,
  Link2,
  Phone,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  label: string;
  icon: React.ElementType;
  href?: string;
  badge?: number;
  children?: { label: string; href: string; badge?: number }[];
}

const menuItems: MenuItem[] = [
  { label: "Mon planning", icon: Calendar, href: "/planning" },
  { label: "Service non planifié", icon: UserX, href: "/services/non-planifie" },
  { label: "Sites", icon: Building2, href: "/sites" },
  { label: "Demandes collaborateurs", icon: Bookmark, href: "/demandes/collaborateurs" },
  { label: "Demandes clients", icon: BookmarkCheck, href: "/demandes/clients" },
  {
    label: "Planification",
    icon: CalendarDays,
    children: [
      { label: "Services", href: "/planification/services" },
      { label: "Planning", href: "/planification/planning" },
    ],
  },
  {
    label: "Terrain",
    icon: Globe,
    children: [
      { label: "Alertes", href: "/terrain/alertes" },
      { label: "Événements", href: "/terrain/evenements" },
    ],
  },
  {
    label: "Points de contrôle",
    icon: MapPin,
    children: [
      { label: "Liste", href: "/points-controle/liste" },
      { label: "Créer", href: "/points-controle/creer" },
    ],
  },
  { label: "Annuaire", icon: Contact, href: "/annuaire" },
  { label: "Mes heures supplémentaires", icon: Users, href: "/heures-supplementaires" },
  { label: "Tableau de bord", icon: BarChart3, href: "/dashboard" },
  {
    label: "Annonces",
    icon: MessageSquare,
    children: [
      { label: "Annonces actives", href: "/annonces/actives", badge: 3 },
      { label: "Mes annonces", href: "/annonces/mes-annonces" },
      { label: "Mes réponses", href: "/annonces/mes-reponses" },
    ],
  },
  {
    label: "Liens utiles",
    icon: Link2,
    children: [
      { label: "À propos", href: "/liens/a-propos" },
      { label: "Tutoriel", href: "/liens/tutoriel" },
      { label: "Documents utiles", href: "/liens/documents" },
    ],
  },
  { label: "Contacter l'agence", icon: Phone, href: "/contact-agence" },
];

export default function Sidebar({ className = "", isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [modeTerrainActive, setModeTerrainActive] = useState(false);

  const toggleSection = (label: string) => {
    setExpandedSections((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isChildActive = (item: MenuItem) => {
    if (!item.children) return false;
    return item.children.some((child) => isActive(child.href));
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
          flex flex-col ${className}`}
      >
        {/* Company Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
              É
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-foreground truncate">
                Éminence Services Nettoyage
              </h2>
              <p className="text-xs text-muted truncate">contact@eminence-sn.com</p>
            </div>
            <button
              onClick={onClose}
              className="ml-auto lg:hidden p-1 rounded hover:bg-gray-100"
            >
              <X size={20} className="text-muted" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = !!item.children;
            const isExpanded = expandedSections.includes(item.label);
            const active = isActive(item.href) || isChildActive(item);

            return (
              <div key={item.label}>
                {hasChildren ? (
                  <button
                    onClick={() => toggleSection(item.label)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50
                      ${active ? "text-primary-500 border-l-3 border-primary-500 bg-primary-50/50" : "text-foreground border-l-3 border-transparent"}`}
                  >
                    <Icon size={18} className={active ? "text-primary-500" : "text-muted"} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {isExpanded ? (
                      <ChevronDown size={16} className="text-muted" />
                    ) : (
                      <ChevronRight size={16} className="text-muted" />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50
                      ${active ? "text-primary-500 border-l-3 border-primary-500 bg-primary-50/50" : "text-foreground border-l-3 border-transparent"}`}
                  >
                    <Icon size={18} className={active ? "text-primary-500" : "text-muted"} />
                    <span className="flex-1">{item.label}</span>
                  </Link>
                )}

                {/* Children */}
                {hasChildren && isExpanded && (
                  <div className="bg-gray-50/50">
                    {item.children!.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`flex items-center gap-3 pl-11 pr-4 py-2 text-sm transition-colors hover:bg-gray-100
                          ${isActive(child.href) ? "text-primary-500 font-medium" : "text-muted"}`}
                      >
                        <span className="flex-1">{child.label}</span>
                        {child.badge !== undefined && child.badge > 0 && (
                          <span className="bg-danger text-white text-xs font-medium rounded-full px-2 py-0.5 min-w-[20px] text-center">
                            {child.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Mode Terrain Toggle */}
        <div className="p-4 border-t border-border">
          <button
            onClick={() => setModeTerrainActive(!modeTerrainActive)}
            className="flex items-center gap-3 w-full text-sm"
          >
            {modeTerrainActive ? (
              <ToggleRight size={24} className="text-primary-500" />
            ) : (
              <ToggleLeft size={24} className="text-muted" />
            )}
            <span className={modeTerrainActive ? "text-primary-500 font-medium" : "text-muted"}>
              Mode Terrain
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
