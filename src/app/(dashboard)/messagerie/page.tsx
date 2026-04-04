'use client';

import { useState } from 'react';
import { Send, Paperclip, Search, Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  contenu: string;
  envoyeParMoi: boolean;
  heure: string;
  lu: boolean;
}

interface Conversation {
  id: string;
  contact: string;
  initiales: string;
  couleur: string;
  dernierMessage: string;
  heure: string;
  nonLus: number;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    contact: 'Marie Dubois',
    initiales: 'MD',
    couleur: 'bg-blue-100 text-blue-700',
    dernierMessage: 'D\'accord, je serai sur place demain à 6h.',
    heure: '14:32',
    nonLus: 2,
    messages: [
      { id: 'm-1', contenu: 'Bonjour Marie, pouvez-vous assurer le remplacement de Jean-Pierre demain matin au Hall A ?', envoyeParMoi: true, heure: '14:15', lu: true },
      { id: 'm-2', contenu: 'Bonjour ! Oui, c\'est possible. À quelle heure dois-je être sur place ?', envoyeParMoi: false, heure: '14:22', lu: true },
      { id: 'm-3', contenu: 'À 6h comme d\'habitude. Le matériel est déjà sur site.', envoyeParMoi: true, heure: '14:25', lu: true },
      { id: 'm-4', contenu: 'D\'accord, je serai sur place demain à 6h.', envoyeParMoi: false, heure: '14:32', lu: false },
      { id: 'm-5', contenu: 'Merci pour le badge, je l\'ai récupéré à l\'accueil.', envoyeParMoi: false, heure: '14:33', lu: false },
    ],
  },
  {
    id: 'conv-2',
    contact: 'Sophie Laurent',
    initiales: 'SL',
    couleur: 'bg-red-100 text-red-700',
    dernierMessage: 'Le rapport d\'inspection est prêt.',
    heure: '11:45',
    nonLus: 0,
    messages: [
      { id: 'm-6', contenu: 'Sophie, avez-vous terminé l\'inspection du site Résidence du Parc ?', envoyeParMoi: true, heure: '10:00', lu: true },
      { id: 'm-7', contenu: 'Oui, j\'ai fait le tour ce matin. Quelques points à signaler sur le bâtiment B.', envoyeParMoi: false, heure: '11:20', lu: true },
      { id: 'm-8', contenu: 'Pouvez-vous m\'envoyer le rapport ?', envoyeParMoi: true, heure: '11:30', lu: true },
      { id: 'm-9', contenu: 'Le rapport d\'inspection est prêt.', envoyeParMoi: false, heure: '11:45', lu: true },
    ],
  },
  {
    id: 'conv-3',
    contact: 'Karim Zidane',
    initiales: 'KZ',
    couleur: 'bg-amber-100 text-amber-700',
    dernierMessage: 'Je confirme la réception du nouveau matériel.',
    heure: 'Hier',
    nonLus: 0,
    messages: [
      { id: 'm-10', contenu: 'Karim, le nouveau matériel a été livré ce matin à la Boulangerie Dupont.', envoyeParMoi: true, heure: '09:00', lu: true },
      { id: 'm-11', contenu: 'Je confirme la réception du nouveau matériel.', envoyeParMoi: false, heure: '09:30', lu: true },
    ],
  },
];

export default function MessageriePage() {
  const [activeConv, setActiveConv] = useState<string>('conv-1');
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState(mockConversations);
  const [searchContact, setSearchContact] = useState('');

  const currentConv = conversations.find(c => c.id === activeConv);

  const filteredConversations = conversations.filter(c =>
    c.contact.toLowerCase().includes(searchContact.toLowerCase())
  );

  const handleSend = () => {
    if (!newMessage.trim() || !activeConv) return;
    const now = new Date();
    const heure = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setConversations(prev =>
      prev.map(c =>
        c.id === activeConv
          ? {
              ...c,
              dernierMessage: newMessage,
              heure,
              messages: [...c.messages, { id: `m-new-${Date.now()}`, contenu: newMessage, envoyeParMoi: true, heure, lu: false }],
            }
          : c
      )
    );
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-surface rounded-card shadow-card overflow-hidden">
      {/* Left Panel - Conversations */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground mb-3">Messagerie</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchContact}
              onChange={(e) => setSearchContact(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv.id)}
              className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${
                activeConv === conv.id ? 'bg-primary-50' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-full ${conv.couleur} flex items-center justify-center text-sm font-bold shrink-0`}>
                {conv.initiales}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{conv.contact}</span>
                  <span className="text-xs text-muted">{conv.heure}</span>
                </div>
                <p className="text-xs text-muted truncate mt-0.5">{conv.dernierMessage}</p>
              </div>
              {conv.nonLus > 0 && (
                <span className="w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {conv.nonLus}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Messages */}
      <div className="flex-1 flex flex-col">
        {currentConv ? (
          <>
            {/* Contact Header */}
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${currentConv.couleur} flex items-center justify-center text-sm font-bold`}>
                {currentConv.initiales}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{currentConv.contact}</h3>
                <p className="text-xs text-muted">En ligne</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {currentConv.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.envoyeParMoi ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                      msg.envoyeParMoi
                        ? 'bg-primary-500 text-white rounded-br-md'
                        : 'bg-gray-100 text-foreground rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm">{msg.contenu}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${msg.envoyeParMoi ? 'text-primary-100' : 'text-muted'}`}>
                      <span className="text-[10px]">{msg.heure}</span>
                      {msg.envoyeParMoi && (
                        msg.lu ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="px-6 py-4 border-t border-border">
              <div className="flex items-center gap-3">
                <button className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-gray-100">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder="Écrire un message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-border rounded-full text-sm text-foreground focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="p-2.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted">
            <p>Sélectionnez une conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
