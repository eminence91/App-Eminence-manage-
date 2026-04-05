'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Building2, Menu, X } from 'lucide-react';

const navTabs = [
  { label: 'Planning', href: '/client-planning' },
  { label: 'Mains courantes', href: '/client-mains-courantes' },
  { label: "Bons d'intervention", href: '/client-bons-intervention' },
  { label: 'Demandes', href: '/client-demandes' },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock client name
  const clientName = 'Société Dupont & Fils';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-teal-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Title */}
            <div className="flex items-center gap-3">
              <Building2 className="h-7 w-7 text-teal-200" />
              <div>
                <h1 className="text-lg font-bold leading-tight">
                  Éminence Manager
                </h1>
                <p className="text-xs text-teal-200 leading-tight">
                  Espace Client
                </p>
              </div>
            </div>

            {/* Desktop: client name + logout */}
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-teal-100">{clientName}</span>
              <button
                className="flex items-center gap-2 bg-teal-800 hover:bg-teal-900 text-white text-sm px-3 py-2 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-teal-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs - Desktop */}
        <nav className="hidden md:block bg-teal-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1">
              {navTabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                      isActive
                        ? 'text-white'
                        : 'text-teal-200 hover:text-white'
                    }`}
                  >
                    {tab.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-teal-800 border-t border-teal-600">
            <div className="px-4 py-3 border-b border-teal-600">
              <p className="text-sm text-teal-200">{clientName}</p>
            </div>
            <nav className="flex flex-col">
              {navTabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 text-sm font-medium border-l-4 transition-colors ${
                      isActive
                        ? 'border-white text-white bg-teal-700/50'
                        : 'border-transparent text-teal-200 hover:text-white hover:bg-teal-700/30'
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
            <div className="px-4 py-3 border-t border-teal-600">
              <button className="flex items-center gap-2 text-sm text-teal-200 hover:text-white transition-colors">
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            Éminence Services Nettoyage
          </p>
        </div>
      </footer>
    </div>
  );
}
