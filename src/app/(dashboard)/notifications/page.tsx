'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Bell, AlertTriangle, MapPin, Phone, Clock, UserX,
  CheckCircle, Filter, Search, ChevronDown, Loader2
} from 'lucide-react';
import { useSupabaseQuery, SUPABASE_CONFIGURED } from '@/hooks/useSupabaseQuery';
import { getNotifications, markNotificationRead as markReadQuery } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/client';

type NotifType = 'service_not_started' | 'perimeter_exit' | 'emergency' | 'incident' | 'interruption' | 'early_departure' | 'leave_request' | 'expiration';

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  site?: string;
  agent?: string;
  time: string;
  isRead: boolean;
}

const typeConfig: Record<NotifType, { icon: React.ReactNode; color: string; label: string }> = {
  service_not_started: { icon: <Clock size={18} />, color: 'text-warning bg-orange-50', label: 'Service non débuté' },
  perimeter_exit: { icon: <MapPin size={18} />, color: 'text-danger bg-red-50', label: 'Sortie périmètre' },
  emergency: { icon: <Phone size={18} />, color: 'text-danger bg-red-50', label: 'Appel urgence' },
  incident: { icon: <AlertTriangle size={18} />, color: 'text-danger bg-red-50', label: 'Incident' },
  interruption: { icon: <UserX size={18} />, color: 'text-warning bg-orange-50', label: 'Interruption' },
  early_departure: { icon: <Clock size={18} />, color: 'text-warning bg-orange-50', label: 'Départ anticipé' },
  leave_request: { icon: <CheckCircle size={18} />, color: 'text-info bg-blue-50', label: 'Demande congé' },
  expiration: { icon: <AlertTriangle size={18} />, color: 'text-purple bg-purple-50', label: 'Expiration' },
};

const mockNotifications: Notification[] = [
  { id: '1', type: 'service_not_started', title: 'Service non débuté', body: 'Mohamed K. n\'a pas pointé — Clinique de Neuilly (retard 15min)', agent: 'Mohamed K.', site: 'Clinique de Neuilly', time: 'Il y a 5 min', isRead: false },
  { id: '2', type: 'perimeter_exit', title: 'Sortie de périmètre', body: 'Ibrahim S. est sorti du périmètre du Centre Commercial Vélizy (distance: 350m)', agent: 'Ibrahim S.', site: 'Centre Commercial Vélizy', time: 'Il y a 12 min', isRead: false },
  { id: '3', type: 'emergency', title: 'Appel d\'urgence', body: 'Fatou D. a déclenché un appel d\'urgence depuis Bureaux Tour Montparnasse', agent: 'Fatou D.', site: 'Bureaux Tour Montparnasse', time: 'Il y a 30 min', isRead: false },
  { id: '4', type: 'incident', title: 'Incident déclaré', body: 'Dégât des eaux signalé par Aminata C. — Résidence Les Jardins', agent: 'Aminata C.', site: 'Résidence Les Jardins', time: 'Il y a 1h', isRead: true },
  { id: '5', type: 'leave_request', title: 'Demande de congé', body: 'Mamadou T. demande des congés payés du 15/04 au 22/04', agent: 'Mamadou T.', time: 'Il y a 2h', isRead: true },
  { id: '6', type: 'expiration', title: 'Expiration titre de séjour', body: 'Le titre de séjour de Fatou D. expire dans 28 jours', agent: 'Fatou D.', time: 'Aujourd\'hui', isRead: true },
  { id: '7', type: 'interruption', title: 'Interruption de service', body: 'Ibrahim S. a interrompu son service au Centre Commercial Vélizy — Motif: problème matériel', agent: 'Ibrahim S.', site: 'Centre Commercial Vélizy', time: 'Hier', isRead: true },
  { id: '8', type: 'early_departure', title: 'Départ anticipé', body: 'Aissatou B. a terminé son service 45 minutes avant l\'heure prévue — Hôpital Saint-Louis', agent: 'Aissatou B.', site: 'Hôpital Saint-Louis', time: 'Hier', isRead: true },
];

/** Map Supabase notification row to local shape */
function mapNotification(r: Record<string, unknown>): Notification {
  // Map the Supabase notification type to the local type
  const typeMap: Record<string, NotifType> = {
    assignment: 'service_not_started',
    schedule_change: 'service_not_started',
    clock_reminder: 'service_not_started',
    incident: 'incident',
    leave_request: 'leave_request',
    leave_response: 'leave_request',
    announcement: 'expiration',
    message: 'leave_request',
    system: 'expiration',
  };

  const createdAt = r.created_at as string;
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  let timeLabel: string;
  if (diffMin < 60) timeLabel = `Il y a ${diffMin} min`;
  else if (diffMin < 1440) timeLabel = `Il y a ${Math.floor(diffMin / 60)}h`;
  else timeLabel = 'Hier';

  return {
    id: r.id as string,
    type: typeMap[(r.type as string) ?? 'system'] ?? 'expiration',
    title: r.title as string,
    body: r.body as string,
    time: timeLabel,
    isRead: (r.read as boolean) ?? false,
  };
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<NotifType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch notifications from Supabase (using a placeholder userId for now)
  const { data: supabaseData, loading, error } = useSupabaseQuery(
    (supabase) => getNotifications(supabase, 'current-user'),
    []
  );

  // Update local state when Supabase data arrives
  useEffect(() => {
    if (supabaseData && supabaseData.length > 0) {
      setNotifications(
        (supabaseData as unknown as Record<string, unknown>[]).map(mapNotification)
      );
    }
  }, [supabaseData]);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;

    const supabase = createClient();
    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          const newNotif = mapNotification(payload.new as Record<string, unknown>);
          setNotifications((prev) => [newNotif, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filtered = notifications.filter(n => {
    if (filter !== 'all' && n.type !== filter) return false;
    if (search && !n.body.toLowerCase().includes(search.toLowerCase()) && !n.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const markAsRead = useCallback(async (id: string) => {
    // Update local state immediately
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));

    // Persist to Supabase
    if (SUPABASE_CONFIGURED) {
      try {
        const supabase = createClient();
        await markReadQuery(supabase, id);
      } catch (err) {
        console.error('Erreur lors du marquage de la notification :', err);
      }
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

    // Persist to Supabase
    if (SUPABASE_CONFIGURED) {
      try {
        const supabase = createClient();
        const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
        for (const id of unreadIds) {
          await markReadQuery(supabase, id);
        }
      } catch (err) {
        console.error('Erreur lors du marquage des notifications :', err);
      }
    }
  }, [notifications]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-danger text-white text-xs px-2 py-0.5 rounded-full font-medium">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="text-sm text-primary-500 hover:text-primary-600">
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-primary-500" />
          <span className="ml-2 text-muted text-sm">Chargement des notifications...</span>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error} — Affichage des données de démonstration.
        </div>
      )}

      {/* Search + Filter */}
      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-gray-50"
          >
            <Filter size={16} />
            Filtres
            <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${filter === 'all' ? 'bg-primary-500 text-white border-primary-500' : 'border-border text-muted hover:bg-gray-50'}`}
            >
              Toutes
            </button>
            {(Object.entries(typeConfig) as [NotifType, typeof typeConfig[NotifType]][]).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${filter === key ? 'bg-primary-500 text-white border-primary-500' : 'border-border text-muted hover:bg-gray-50'}`}
              >
                {cfg.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {filtered.map(notif => {
          const cfg = typeConfig[notif.type];
          return (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`bg-surface rounded-card shadow-card p-4 cursor-pointer transition-colors hover:bg-gray-50 ${!notif.isRead ? 'border-l-4 border-l-primary-500' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm ${!notif.isRead ? 'font-semibold' : 'font-medium'} text-foreground`}>
                        {notif.title}
                      </p>
                      <p className="text-sm text-muted mt-0.5">{notif.body}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notif.isRead && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                      <span className="text-xs text-muted whitespace-nowrap">{notif.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                    {notif.site && <span className="text-xs text-muted">📍 {notif.site}</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-surface rounded-card shadow-card p-8 text-center">
            <Bell size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-muted">Aucune notification</p>
          </div>
        )}
      </div>
    </div>
  );
}
