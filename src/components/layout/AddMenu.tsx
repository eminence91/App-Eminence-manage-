"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  CalendarPlus,
  CalendarOff,
  UserCog,
  FileText,
  Wrench,
  Info,
  Building2,
  MapPin,
  UserPlus,
  ClipboardList,
  File,
  FileSignature,
  Receipt,
  CreditCard,
  Package,
  Truck,
  Users,
  Bookmark,
  FileArchive,
  Wallet,
  FolderOpen,
  Megaphone,
  X,
} from "lucide-react";
import ServiceForm from "@/components/forms/ServiceForm";
import ClientForm from "@/components/forms/ClientForm";
import SiteForm from "@/components/forms/SiteForm";
import CollaborateurForm from "@/components/forms/CollaborateurForm";
import IndisponibiliteForm from "@/components/forms/IndisponibiliteForm";
import DemandeForm from "@/components/forms/DemandeForm";
import BonInterventionForm from "@/components/forms/BonInterventionForm";

type FormKey =
  | "service"
  | "client"
  | "site"
  | "collaborateur"
  | "indisponibilite"
  | "demande-collaborateur"
  | "bon-intervention"
  | null;

interface AddMenuProps {
  className?: string;
  onClose: () => void;
}

interface AddMenuItem {
  label: string;
  icon: React.ElementType;
  href?: string;
}

interface AddMenuSection {
  title: string;
  items: AddMenuItem[];
}

const sections: AddMenuSection[] = [
  {
    title: "Planification",
    items: [
      { label: "Service", icon: CalendarPlus, href: "/ajouter/service" },
      { label: "Indisponibilité", icon: CalendarOff, href: "/ajouter/indisponibilite" },
      { label: "Remplacement agent", icon: UserCog, href: "/ajouter/remplacement" },
    ],
  },
  {
    title: "Terrain",
    items: [
      { label: "Main courante", icon: FileText, href: "/ajouter/main-courante" },
      { label: "Bon d'intervention", icon: Wrench, href: "/ajouter/bon-intervention" },
      { label: "Note d'information", icon: Info, href: "/ajouter/note-information" },
    ],
  },
  {
    title: "Site",
    items: [
      { label: "Site", icon: Building2, href: "/ajouter/site" },
      { label: "Point de contrôle", icon: MapPin, href: "/ajouter/point-controle" },
    ],
  },
  {
    title: "Client",
    items: [
      { label: "Client", icon: UserPlus, href: "/ajouter/client" },
      { label: "Demande client", icon: ClipboardList, href: "/ajouter/demande-client" },
      { label: "Document client", icon: File, href: "/ajouter/document-client" },
      { label: "Contrat client", icon: FileSignature, href: "/ajouter/contrat-client" },
    ],
  },
  {
    title: "Facturation",
    items: [
      { label: "Devis", icon: Receipt, href: "/ajouter/devis" },
      { label: "Facture & Avoir", icon: CreditCard, href: "/ajouter/facture" },
      { label: "Abonnement", icon: Wallet, href: "/ajouter/abonnement" },
      { label: "Bon de commande", icon: Package, href: "/ajouter/bon-commande" },
      { label: "Bon de livraison", icon: Truck, href: "/ajouter/bon-livraison" },
    ],
  },
  {
    title: "Collaborateurs",
    items: [
      { label: "Collaborateur", icon: Users, href: "/ajouter/collaborateur" },
      { label: "Demande collaborateur", icon: Bookmark, href: "/ajouter/demande-collaborateur" },
      { label: "Document collaborateur", icon: FileArchive, href: "/ajouter/document-collaborateur" },
      { label: "Contrat collaborateur", icon: FileSignature, href: "/ajouter/contrat-collaborateur" },
      { label: "Élément de salaire", icon: Wallet, href: "/ajouter/element-salaire" },
    ],
  },
  {
    title: "Agence",
    items: [
      { label: "Document agence", icon: FolderOpen, href: "/ajouter/document-agence" },
    ],
  },
  {
    title: "Annonces",
    items: [
      { label: "Annonce", icon: Megaphone, href: "/ajouter/annonce" },
    ],
  },
];

/** Correspondance label → clé de formulaire */
const labelToFormKey: Record<string, FormKey> = {
  "Service": "service",
  "Client": "client",
  "Site": "site",
  "Collaborateur": "collaborateur",
  "Indisponibilité": "indisponibilite",
  "Demande collaborateur": "demande-collaborateur",
  "Bon d'intervention": "bon-intervention",
};

export default function AddMenu({ className = "", onClose }: AddMenuProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeForm, setActiveForm] = useState<FormKey>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const filteredSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div
      ref={menuRef}
      className={`absolute right-0 top-full mt-2 bg-white rounded-lg shadow-modal border border-border z-50
        w-[calc(100vw-2rem)] max-w-sm sm:w-80
        max-h-[70vh] overflow-hidden flex flex-col ${className}`}
    >
      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-gray-50 text-sm text-foreground placeholder-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="overflow-y-auto flex-1 py-1">
        {filteredSections.map((section, idx) => (
          <div key={section.title}>
            {idx > 0 && <div className="border-t border-border mx-3" />}
            <div className="px-3 pt-3 pb-1">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">
                {section.title}
              </h3>
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    const formKey = labelToFormKey[item.label] ?? null;
                    if (formKey) {
                      setActiveForm(formKey);
                    }
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  <Icon size={16} className="text-muted shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}

        {filteredSections.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted">
            Aucun résultat pour &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
      {/* --- Modales de formulaires --- */}
      <ServiceForm
        isOpen={activeForm === "service"}
        onClose={() => setActiveForm(null)}
      />
      <ClientForm
        isOpen={activeForm === "client"}
        onClose={() => setActiveForm(null)}
      />
      <SiteForm
        isOpen={activeForm === "site"}
        onClose={() => setActiveForm(null)}
      />
      <CollaborateurForm
        isOpen={activeForm === "collaborateur"}
        onClose={() => setActiveForm(null)}
      />
      <IndisponibiliteForm
        isOpen={activeForm === "indisponibilite"}
        onClose={() => setActiveForm(null)}
      />
      <DemandeForm
        isOpen={activeForm === "demande-collaborateur"}
        onClose={() => setActiveForm(null)}
      />
      <BonInterventionForm
        isOpen={activeForm === "bon-intervention"}
        onClose={() => setActiveForm(null)}
      />
    </div>
  );
}
