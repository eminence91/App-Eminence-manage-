'use client';

import { useState } from 'react';
import {
  Calendar, Users, AlertTriangle, Clock, FileText,
  TrendingUp, Package, ClipboardList, Bell, BarChart3,
  ChevronRight, MapPin, UserCheck, UserX, Timer
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
  return (
    <div className="bg-surface rounded-card shadow-card p-4 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

interface AlertItemProps {
  title: string;
  description: string;
  time: string;
  type: 'danger' | 'warning' | 'info';
}

function AlertItem({ title, description, time, type }: AlertItemProps) {
  const colors = {
    danger: 'border-l-danger bg-red-50',
    warning: 'border-l-warning bg-orange-50',
    info: 'border-l-info bg-blue-50',
  };
  return (
    <div className={`border-l-4 ${colors[type]} p-3 rounded-r-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted mt-0.5">{description}</p>
        </div>
        <span className="text-xs text-muted whitespace-nowrap ml-2">{time}</span>
      </div>
    </div>
  );
}

interface ServiceItemProps {
  site: string;
  agent: string;
  time: string;
  status: 'en_cours' | 'planifie' | 'termine' | 'non_debute';
}

function ServiceItem({ site, agent, time, status }: ServiceItemProps) {
  const statusConfig = {
    en_cours: { label: 'En cours', color: 'bg-success text-white' },
    planifie: { label: 'Planifié', color: 'bg-info text-white' },
    termine: { label: 'Terminé', color: 'bg-gray-400 text-white' },
    non_debute: { label: 'Non débuté', color: 'bg-warning text-white' },
  };
  const cfg = statusConfig[status];

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{site}</p>
        <p className="text-xs text-muted">{agent} — {time}</p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${cfg.color}`}>
        {cfg.label}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const [period] = useState<'today' | 'week' | 'month'>('today');

  // Demo data
  const stats = {
    servicesJour: 12,
    agentsEnPoste: 8,
    agentsAbsents: 2,
    servicesNonPlanifies: 3,
    heuresSupp: '24h',
    demandesEnAttente: 5,
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-sm text-muted">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${period === 'today' ? 'bg-primary-500 text-white' : 'bg-surface text-muted hover:bg-gray-100'}`}>
            Aujourd&apos;hui
          </button>
          <button className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${period === 'week' ? 'bg-primary-500 text-white' : 'bg-surface text-muted hover:bg-gray-100'}`}>
            Semaine
          </button>
          <button className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${period === 'month' ? 'bg-primary-500 text-white' : 'bg-surface text-muted hover:bg-gray-100'}`}>
            Mois
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Services du jour"
          value={stats.servicesJour}
          icon={<Calendar size={24} className="text-white" />}
          color="bg-primary-500"
          subtitle="8 terminés, 4 en cours"
        />
        <StatCard
          title="Agents en poste"
          value={stats.agentsEnPoste}
          icon={<UserCheck size={24} className="text-white" />}
          color="bg-success"
        />
        <StatCard
          title="Absents / Retard"
          value={stats.agentsAbsents}
          icon={<UserX size={24} className="text-white" />}
          color="bg-danger"
        />
        <StatCard
          title="Non planifiés"
          value={stats.servicesNonPlanifies}
          icon={<AlertTriangle size={24} className="text-white" />}
          color="bg-warning"
        />
        <StatCard
          title="Heures supp."
          value={stats.heuresSupp}
          icon={<Timer size={24} className="text-white" />}
          color="bg-purple"
        />
        <StatCard
          title="Demandes"
          value={stats.demandesEnAttente}
          icon={<ClipboardList size={24} className="text-white" />}
          color="bg-info"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services du jour */}
        <div className="lg:col-span-2 bg-surface rounded-card shadow-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Calendar size={18} className="text-primary-500" />
              Services du jour
            </h2>
            <button className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
              Voir tout <ChevronRight size={16} />
            </button>
          </div>
          <div className="p-4">
            <ServiceItem site="Clinique de Neuilly" agent="Mohamed K." time="08:00 - 16:00" status="en_cours" />
            <ServiceItem site="Bureaux Tour Montparnasse" agent="Fatou D." time="06:00 - 14:00" status="termine" />
            <ServiceItem site="Centre Commercial Vélizy" agent="Ibrahim S." time="09:00 - 17:00" status="en_cours" />
            <ServiceItem site="Résidence Les Jardins" agent="—" time="14:00 - 22:00" status="non_debute" />
            <ServiceItem site="Hôpital Saint-Louis" agent="Aminata C." time="07:00 - 15:00" status="planifie" />
          </div>
        </div>

        {/* Alertes */}
        <div className="bg-surface rounded-card shadow-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Bell size={18} className="text-danger" />
              Alertes
            </h2>
            <span className="bg-danger text-white text-xs px-2 py-0.5 rounded-full">4</span>
          </div>
          <div className="p-4 space-y-3">
            <AlertItem
              title="Service non débuté"
              description="Mohamed K. — Clinique Neuilly (retard 15min)"
              time="Il y a 5min"
              type="danger"
            />
            <AlertItem
              title="Sortie de périmètre"
              description="Ibrahim S. — Centre Commercial Vélizy"
              time="Il y a 12min"
              type="danger"
            />
            <AlertItem
              title="Expiration titre de séjour"
              description="Fatou D. — expire dans 28 jours"
              time="Aujourd'hui"
              type="warning"
            />
            <AlertItem
              title="Demande de congé"
              description="Aminata C. — 15/04 au 22/04"
              time="Hier"
              type="info"
            />
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heures planifiées vs réalisées */}
        <div className="bg-surface rounded-card shadow-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <BarChart3 size={18} className="text-primary-500" />
              Heures planifiées vs réalisées
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day, i) => {
                const planned = [48, 52, 44, 56, 50, 24][i];
                const actual = [45, 50, 42, 54, 48, 22][i];
                const maxVal = 60;
                return (
                  <div key={day} className="flex items-center gap-3">
                    <span className="text-xs text-muted w-8">{day}</span>
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-200 rounded-full" style={{ width: `${(planned / maxVal) * 100}%` }} />
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(actual / maxVal) * 100}%` }} />
                      </div>
                    </div>
                    <div className="text-xs text-muted w-16 text-right">
                      {actual}h / {planned}h
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary-200" />
                <span className="text-xs text-muted">Planifié</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary-500" />
                <span className="text-xs text-muted">Réalisé</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions + stocks + etc */}
        <div className="space-y-6">
          {/* Demandes en attente */}
          <div className="bg-surface rounded-card shadow-card">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <ClipboardList size={18} className="text-info" />
                Demandes en attente
              </h2>
              <span className="bg-info text-white text-xs px-2 py-0.5 rounded-full">{stats.demandesEnAttente}</span>
            </div>
            <div className="p-4 space-y-3">
              {[
                { name: 'Aminata C.', type: 'Congés payés', dates: '15/04 — 22/04' },
                { name: 'Ibrahim S.', type: 'Événement familial', dates: '10/04' },
                { name: 'Fatou D.', type: 'Maladie', dates: '05/04 — 07/04' },
              ].map((req, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{req.name}</p>
                    <p className="text-xs text-muted">{req.type} — {req.dates}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-xs px-2 py-1 bg-success text-white rounded hover:bg-green-600">Accepter</button>
                    <button className="text-xs px-2 py-1 bg-danger text-white rounded hover:bg-red-600">Refuser</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accès rapides */}
          <div className="bg-surface rounded-card shadow-card p-4">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-primary-500" />
              Accès rapides
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <MapPin size={20} />, label: 'Supervision', href: '/terrain/supervision' },
                { icon: <Users size={20} />, label: 'Collaborateurs', href: '/collaborateurs' },
                { icon: <FileText size={20} />, label: 'Exports', href: '/exports' },
                { icon: <Package size={20} />, label: 'Stocks', href: '/stocks' },
                { icon: <Clock size={20} />, label: 'Clôture', href: '/facturation/cloture-mensuelle' },
                { icon: <Calendar size={20} />, label: 'Planning', href: '/planning' },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-border"
                >
                  <div className="text-primary-500">{item.icon}</div>
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
