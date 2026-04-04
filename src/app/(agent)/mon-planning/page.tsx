'use client';

import React, { useState } from 'react';
import { MapPin, Clock, ChevronRight, ChevronLeft, ChevronDown, Key, FileText, X } from 'lucide-react';
import { format, startOfWeek, addDays, isToday, isBefore, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Service {
  id: string;
  site: string;
  address: string;
  date: Date;
  startTime: string;
  endTime: string;
  prestation: string;
  status: 'upcoming' | 'in-progress' | 'completed';
  consignes: string;
  cles: string;
}

const now = new Date();
const weekStart = startOfWeek(now, { weekStartsOn: 1 });

const mockServices: Service[] = [
  {
    id: '1',
    site: 'Tour Montparnasse - Étage 12',
    address: '33 Avenue du Maine, 75015 Paris',
    date: addDays(weekStart, 0),
    startTime: '06:00',
    endTime: '09:00',
    prestation: 'Nettoyage bureaux',
    status: 'completed',
    consignes: 'Utiliser les produits écologiques. Vider toutes les corbeilles. Nettoyer les vitres intérieures.',
    cles: 'Badge N°4523 — Boîte à clés entrée parking niveau -1',
  },
  {
    id: '2',
    site: 'Cabinet Médical Dr. Martin',
    address: '15 Rue de Rivoli, 75004 Paris',
    date: addDays(weekStart, 1),
    startTime: '12:00',
    endTime: '14:00',
    prestation: 'Désinfection médicale',
    status: 'upcoming',
    consignes: 'Porter les EPI obligatoires (gants, masque, charlotte). Protocole désinfection surfaces hautes priorité.',
    cles: 'Code porte : 4821B — Clé armoire produits chez la secrétaire',
  },
  {
    id: '3',
    site: 'Restaurant Le Petit Zinc',
    address: '11 Rue Saint-Benoît, 75006 Paris',
    date: addDays(weekStart, 2),
    startTime: '15:00',
    endTime: '17:30',
    prestation: 'Nettoyage cuisine professionnelle',
    status: 'upcoming',
    consignes: 'Dégraissage hotte et plan de travail. Ne pas déplacer les ustensiles du chef. Attention sol glissant.',
    cles: 'Entrée par la porte arrière — Sonner 2 fois',
  },
  {
    id: '4',
    site: 'Copropriété Haussmann',
    address: '88 Boulevard Haussmann, 75008 Paris',
    date: addDays(weekStart, 4),
    startTime: '08:00',
    endTime: '11:00',
    prestation: 'Entretien parties communes',
    status: 'upcoming',
    consignes: 'Escalier du RDC au 6ème. Lustrer la rampe en laiton. Nettoyer les boîtes aux lettres.',
    cles: 'Clé gardien — Passer au loge avant 8h15',
  },
];

export default function MonPlanningPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(weekStart);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const getServicesForDay = (day: Date) =>
    mockServices.filter(
      (s) => format(s.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );

  const statusStyles = {
    upcoming: 'border-l-primary-500 bg-primary-50',
    'in-progress': 'border-l-green-500 bg-green-50',
    completed: 'border-l-gray-400 bg-gray-50',
  };

  const statusLabel = {
    upcoming: 'À venir',
    'in-progress': 'En cours',
    completed: 'Terminé',
  };

  const statusBadge = {
    upcoming: 'bg-primary-100 text-primary-700',
    'in-progress': 'bg-green-100 text-green-700',
    completed: 'bg-gray-200 text-gray-500',
  };

  return (
    <div className="p-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
          className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-base font-semibold text-gray-800">
          Semaine du {format(currentWeekStart, 'd MMMM', { locale: fr })}
        </h2>
        <button
          onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
          className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Day pills */}
      <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
        {days.map((day) => {
          const hasServices = getServicesForDay(day).length > 0;
          const today = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={`flex flex-col items-center min-w-[44px] py-2 px-2 rounded-xl text-xs font-medium transition-colors ${
                today
                  ? 'bg-primary-700 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <span className="uppercase text-[10px]">
                {format(day, 'EEE', { locale: fr })}
              </span>
              <span className="text-base font-bold mt-0.5">{format(day, 'd')}</span>
              {hasServices && (
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1 ${
                    today ? 'bg-white' : 'bg-primary-500'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Services list by day */}
      <div className="space-y-5">
        {days.map((day) => {
          const services = getServicesForDay(day);
          if (services.length === 0) return null;
          return (
            <div key={day.toISOString()}>
              <h3
                className={`text-sm font-semibold mb-2 ${
                  isToday(day) ? 'text-primary-700' : 'text-gray-500'
                }`}
              >
                {isToday(day) ? "Aujourd'hui" : format(day, 'EEEE d MMMM', { locale: fr })}
              </h3>
              <div className="space-y-2">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`w-full text-left p-3 rounded-xl border-l-4 shadow-sm active:scale-[0.98] transition-transform ${statusStyles[service.status]}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {service.site}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                          {service.startTime} - {service.endTime}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{service.address}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-2">
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusBadge[service.status]}`}
                        >
                          {statusLabel[service.status]}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs font-medium text-primary-700 bg-primary-50 inline-block px-2 py-0.5 rounded">
                      {service.prestation}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-bold text-gray-900">Détail du service</h3>
              <button
                onClick={() => setSelectedService(null)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-lg font-bold text-gray-900">
                  {selectedService.site}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  {selectedService.address}
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {selectedService.startTime} - {selectedService.endTime}
                </div>
                <span className="inline-block mt-2 text-sm font-medium text-primary-700 bg-primary-50 px-3 py-1 rounded-lg">
                  {selectedService.prestation}
                </span>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <h5 className="font-semibold text-amber-800 text-sm">Consignes</h5>
                </div>
                <p className="text-sm text-amber-900">{selectedService.consignes}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Key className="w-4 h-4 text-blue-600" />
                  <h5 className="font-semibold text-blue-800 text-sm">Clés et accès</h5>
                </div>
                <p className="text-sm text-blue-900">{selectedService.cles}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
