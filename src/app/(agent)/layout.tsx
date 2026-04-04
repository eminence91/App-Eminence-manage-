'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Play, FileText, Users, Bell } from 'lucide-react';
import EmergencyButton from '@/components/terrain/EmergencyButton';

const navItems = [
  { href: '/mon-planning', label: 'Planning', icon: Calendar },
  { href: '/service-actif', label: 'Service', icon: Play },
  { href: '/mes-demandes', label: 'Demandes', icon: FileText },
  { href: '/repertoire', label: 'Annuaire', icon: Users },
];

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-primary-700 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <h1 className="text-xl font-bold tracking-tight">Éminence</h1>
        <button className="relative p-2 rounded-full hover:bg-primary-600 active:bg-primary-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-primary-700" />
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Emergency floating button */}
      <EmergencyButton />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full min-w-[64px] transition-colors ${
                  isActive
                    ? 'text-primary-700'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
