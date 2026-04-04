"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Megaphone,
  Bell,
  MessageCircle,
  User,
  Menu,
} from "lucide-react";
import AddMenu from "./AddMenu";
import NotificationBell from "./NotificationBell";

interface HeaderProps {
  className?: string;
  onMenuToggle?: () => void;
  notificationCount?: number;
}

export default function Header({
  className = "",
  onMenuToggle,
  notificationCount = 0,
}: HeaderProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header
      className={`sticky top-0 z-30 bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md ${className}`}
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Menu"
          >
            <Menu size={22} />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight">
              Éminence Manager
            </span>
          </Link>
        </div>

        {/* Search bar - desktop */}
        {showSearch && (
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-white/15 text-white placeholder-white/60 text-sm border border-white/20 focus:outline-none focus:bg-white/25 focus:border-white/40 transition-colors"
                autoFocus
                onBlur={() => setShowSearch(false)}
              />
            </div>
          </div>
        )}

        {/* Right icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Rechercher"
          >
            <Search size={20} />
          </button>

          {/* Add button */}
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="p-1.5 rounded-full bg-success hover:bg-success/90 transition-colors ml-1"
              aria-label="Ajouter"
            >
              <Plus size={18} />
            </button>
            {showAddMenu && (
              <AddMenu onClose={() => setShowAddMenu(false)} />
            )}
          </div>

          <button
            className="p-2 rounded-lg hover:bg-white/10 transition-colors hidden sm:block"
            aria-label="Alertes"
          >
            <Megaphone size={20} />
          </button>

          {/* Notification Bell */}
          <NotificationBell count={notificationCount} />

          <button
            className="p-2 rounded-lg hover:bg-white/10 transition-colors hidden sm:block"
            aria-label="Messages"
          >
            <MessageCircle size={20} />
          </button>

          <Link
            href="/profil"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Profil"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <User size={16} />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
