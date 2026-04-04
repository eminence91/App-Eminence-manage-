"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, MessageCircle, AlertTriangle, Info, Calendar } from "lucide-react";
import Link from "next/link";

interface NotificationBellProps {
  className?: string;
  count?: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "alert" | "message" | "calendar";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Nouveau service assigné",
    message: "Un nouveau service a été planifié pour demain",
    time: "Il y a 5 min",
    read: false,
    type: "calendar",
  },
  {
    id: "2",
    title: "Alerte terrain",
    message: "Un incident a été signalé sur le site Bureaux Montparnasse",
    time: "Il y a 30 min",
    read: false,
    type: "alert",
  },
  {
    id: "3",
    title: "Message de l'agence",
    message: "Réunion d'équipe prévue vendredi à 9h",
    time: "Il y a 2h",
    read: false,
    type: "message",
  },
  {
    id: "4",
    title: "Demande approuvée",
    message: "Votre demande de congé a été validée",
    time: "Hier",
    read: true,
    type: "info",
  },
];

const typeIcons: Record<string, React.ElementType> = {
  info: Info,
  alert: AlertTriangle,
  message: MessageCircle,
  calendar: Calendar,
};

const typeColors: Record<string, string> = {
  info: "bg-info/10 text-info",
  alert: "bg-warning/10 text-warning",
  message: "bg-primary-100 text-primary-600",
  calendar: "bg-success/10 text-success",
};

export default function NotificationBell({ className = "", count }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = count ?? notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-white/10 transition-colors relative"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-danger text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-modal border border-border z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary-500 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                <Check size={12} />
                Tout marquer comme lu
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {notifications.map((notification) => {
              const Icon = typeIcons[notification.type];
              const colorClass = typeColors[notification.type];

              return (
                <button
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50
                    ${!notification.read ? "bg-primary-50/30" : ""}`}
                >
                  <div className={`p-2 rounded-full shrink-0 ${colorClass}`}>
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm truncate ${!notification.read ? "font-semibold text-foreground" : "text-foreground"}`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-muted mt-1">{notification.time}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-border">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="block text-center py-3 text-sm text-primary-500 hover:text-primary-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Voir tout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
