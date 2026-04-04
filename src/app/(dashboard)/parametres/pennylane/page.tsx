'use client';

import { useState } from 'react';
import {
  Key, RefreshCw, CheckCircle, XCircle, ExternalLink,
  Upload, Download, Clock, AlertCircle, BookOpen, Zap
} from 'lucide-react';

export default function PennyLanePage() {
  const [apiKey, setApiKey] = useState('pl_live_••••••••••••••••••••••••');
  const [showKey, setShowKey] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('connected');
  const [toast, setToast] = useState<string | null>(null);

  const handleTestConnection = () => {
    setConnectionStatus('testing');
    setTimeout(() => {
      setConnectionStatus('connected');
      setToast('Connexion réussie');
      setTimeout(() => setToast(null), 3000);
    }, 1500);
  };

  const handleSync = (type: string) => {
    setToast(`Synchronisation ${type} lancée...`);
    setTimeout(() => {
      setToast(`${type} synchronisés avec succès`);
      setTimeout(() => setToast(null), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Configuration PennyLane</h1>
          {connectionStatus === 'connected' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Connecté
            </span>
          )}
          {connectionStatus === 'disconnected' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
              <XCircle className="w-4 h-4" />
              Déconnecté
            </span>
          )}
          {connectionStatus === 'testing' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Test en cours...
            </span>
          )}
        </div>
      </div>

      {/* API Key */}
      <div className="bg-surface rounded-card shadow-card p-6">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-muted" />
          Clé API
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-lg">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-foreground font-mono focus:ring-2 focus:ring-primary-500 outline-none pr-20"
              placeholder="pl_live_..."
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              {showKey ? 'Masquer' : 'Afficher'}
            </button>
          </div>
          <button
            onClick={handleTestConnection}
            disabled={connectionStatus === 'testing'}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            Tester la connexion
          </button>
        </div>
        <p className="text-xs text-muted mt-2">
          Votre clé API PennyLane se trouve dans Paramètres &gt; API &gt; Clés d'API de votre compte PennyLane.
        </p>
      </div>

      {/* Sync Status */}
      <div className="bg-surface rounded-card shadow-card p-6">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-muted" />
          Statut de synchronisation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-muted" />
              <span className="text-sm text-muted">Dernière synchronisation</span>
            </div>
            <p className="text-lg font-semibold text-foreground">03/04/2026 08:30</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-muted">Clients synchronisés</span>
            </div>
            <p className="text-lg font-semibold text-foreground">4 / 5</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-muted">Erreurs récentes</span>
            </div>
            <p className="text-lg font-semibold text-foreground">0</p>
          </div>
        </div>
      </div>

      {/* Manual Sync */}
      <div className="bg-surface rounded-card shadow-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Synchronisation manuelle</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleSync('Import clients')}
            className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Importer les clients</p>
              <p className="text-xs text-muted">Récupérer les clients depuis PennyLane</p>
            </div>
          </button>
          <button
            onClick={() => handleSync('Export clients')}
            className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Exporter les clients</p>
              <p className="text-xs text-muted">Envoyer les clients vers PennyLane</p>
            </div>
          </button>
        </div>
      </div>

      {/* Documentation */}
      <div className="bg-surface rounded-card shadow-card p-6">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-muted" />
          Documentation technique
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Endpoints utilisés</h3>
            <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs text-foreground space-y-1.5">
              <p><span className="text-green-600 font-semibold">GET</span> /api/external/v2/customers — Liste des clients</p>
              <p><span className="text-blue-600 font-semibold">POST</span> /api/external/v2/customers — Création d'un client</p>
              <p><span className="text-blue-600 font-semibold">POST</span> /api/external/v2/customer_invoices — Création d'une facture</p>
              <p><span className="text-green-600 font-semibold">GET</span> /api/external/v2/customer_invoices — Liste des factures</p>
              <p><span className="text-amber-600 font-semibold">PUT</span> /api/external/v2/customer_invoices/:id — Mise à jour facture</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Limitations</h3>
            <ul className="text-sm text-muted space-y-1.5">
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                Rate limit : 100 requêtes par minute
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                Les avoirs doivent être créés manuellement dans PennyLane
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                La synchronisation des paiements est unidirectionnelle (PennyLane vers Éminence)
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                Les modifications de factures envoyées nécessitent un avoir
              </li>
            </ul>
          </div>

          <a
            href="https://pennylane.tech/api"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            Documentation API PennyLane
          </a>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-foreground text-white px-4 py-3 rounded-lg shadow-modal flex items-center gap-2 z-50">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-sm">{toast}</span>
        </div>
      )}
    </div>
  );
}
