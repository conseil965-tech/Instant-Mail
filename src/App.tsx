/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Mail, RefreshCw, Trash2, Copy, Check, ChevronRight, Loader2, X, ChevronDown, AlertCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { mailTmService } from './lib/mail-tm';
import { Account, Message, FAQItem } from './types';

const FAQ_DATA: FAQItem[] = [
  {
    question: "Qu'est-ce qu'un email temporaire jetable ?",
    answer: "Un e-mail temporaire est une boîte aux lettres éphémère qui s'autodétruit après un certain temps. Elle vous permet de vous inscrire sur des sites web sans divulguer votre véritable identité."
  },
  {
    question: "Est-ce que ce service est gratuit ?",
    answer: "Oui, notre service est 100% gratuit, anonyme et ne nécessite aucune inscription préalable."
  },
  {
    question: "Combien de temps les emails restent-ils actifs ?",
    answer: "Tant que vous gardez cette page ouverte, l'adresse reste active pour recevoir tous vos codes de validation ou liens de confirmation."
  }
];

export default function App() {
  const [account, setAccount] = useState<Account | null>(() => {
    const saved = localStorage.getItem('instantmail_account');
    return saved ? JSON.parse(saved) : null;
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    if (account) {
      localStorage.setItem('instantmail_account', JSON.stringify(account));
    }
  }, [account]);

  const loadMessages = useCallback(async (token: string) => {
    if (retryAfter > 0) return;
    try {
      const msgs = await mailTmService.getMessages(token);
      setMessages(msgs);
      setError(null);
    } catch (err: any) {
      console.error('Error loading messages:', err);
      if (err.response?.status === 429) {
        setError('Limite de requêtes atteinte. Pause automatique de 30s.');
        setRetryAfter(30);
      } else {
        setError('Erreur de connexion au serveur.');
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [retryAfter]);

  const createAccount = async () => {
    if (account) return;
    setIsLoading(true);
    setError(null);
    try {
      const domains = await mailTmService.getDomains();
      if (!domains || domains.length === 0) {
        throw new Error('Aucun domaine disponible');
      }
      const domain = domains[0].domain;
      const username = Math.random().toString(36).substring(2, 12);
      const password = Math.random().toString(36).substring(2, 15);
      const address = `${username}@${domain}`;

      await mailTmService.createAccount(address, password);
      const token = await mailTmService.getToken(address, password);
      
      const newAccount: Account = {
        id: username,
        address,
        password,
        token,
        quota: 0,
        used: 0,
        isDisabled: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setAccount(newAccount);
      setMessages([]);
    } catch (err: any) {
      console.error('Error creating account:', err);
      if (err.response?.status === 429) {
        setError('Trop de requêtes. Veuillez réessayer dans quelques minutes.');
      } else {
        setError('Échec de la création de l\'email. Veuillez actualiser.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!account) {
      createAccount();
    }
  }, [account]);

  useEffect(() => {
    if (retryAfter > 0) {
      const timer = setInterval(() => {
        setRetryAfter((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [retryAfter]);

  useEffect(() => {
    if (account?.token && retryAfter === 0) {
      const interval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          loadMessages(account.token!);
        }
      }, 15000);
      loadMessages(account.token!);
      return () => clearInterval(interval);
    }
  }, [account?.token, loadMessages, retryAfter]);

  const copyToClipboard = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openMessage = async (id: string) => {
    if (!account?.token) return;
    try {
      const msg = await mailTmService.getMessage(id, account.token);
      setSelectedMessage(msg);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error loading message details:', error);
    }
  };

  const handleRefresh = () => {
    if (account?.token) {
      setIsRefreshing(true);
      loadMessages(account.token);
    }
  };

  const handleDelete = () => {
    setAccount(null);
    setMessages([]);
    localStorage.removeItem('instantmail_account');
    setError(null);
    setRetryAfter(0);
  };

  return (
    <div className="relative min-h-screen bg-bg-dark overflow-hidden">
      {/* Background Video */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60 scale-110"
        >
          <source src="https://res.cloudinary.com/ensdqbmy/video/upload/v1783680734/Icy_blue_envelope_rotates_spins_202607100944_vrkyfh.mp4" type="video/mp4" />
          {/* Fallback to original abstract elements if video fails */}
        </video>
        <div className="absolute inset-0 bg-bg-dark/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Abstract Background Elements (Backups) */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="relative z-50 px-10 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Mail className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Instant<span className="text-indigo-400">Mail</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Server Active</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Your Temporary Address
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Safe, anonymous, and disposable. Protect your privacy and keep your inbox clean from spam and unwanted tracking.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto glass rounded-[32px] p-8 md:p-12 shadow-2xl"
        >
          {/* Email Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium flex items-center justify-center gap-2"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}
          <div className="bg-white/10 border border-white/10 rounded-2xl p-2 mb-8 shadow-inner focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <input
              type="text"
              readOnly
              value={isLoading ? "Génération de l'adresse..." : account?.address || ""}
              className="w-full bg-transparent border-none outline-none px-6 py-4 text-2xl font-mono font-medium text-indigo-300 text-center"
              placeholder="Chargement..."
            />
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={copyToClipboard}
              disabled={isLoading || !account}
              className="flex items-center gap-2 px-6 py-4 bg-white/10 border border-white/10 rounded-2xl text-white font-semibold hover:bg-white/20 transition-all disabled:opacity-50 group shadow-lg"
            >
              {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} className="text-indigo-400" />}
              {copied ? "Copié !" : "Copy Address"}
            </button>
            <button
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              className="px-6 py-4 bg-white/10 border border-white/10 rounded-2xl text-white font-semibold hover:bg-white/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw size={20} className={`text-indigo-400 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="px-6 py-4 bg-white/10 border border-white/10 rounded-2xl text-white font-semibold hover:bg-white/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 size={20} className="text-red-400" />
              New Address
            </button>
          </div>

          {/* Inbox Area */}
          <div className="text-left border-t border-white/10 pt-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Mail size={24} className="text-indigo-400" />
                Recent Messages
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted">
                  {retryAfter > 0 ? (
                    <>Reprise dans <span className="text-red-400 font-mono">{retryAfter}s</span></>
                  ) : (
                    <>Auto-refresh <span className="text-primary font-mono">15s</span></>
                  )}
                </span>
                <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                  {messages.length} Active
                </span>
              </div>
            </div>

            <div className="min-h-[250px] relative">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-text-muted">
                  <Loader2 size={40} className="animate-spin mb-4 text-primary" />
                  <p className="font-medium">Configuring your secure workspace...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-text-muted text-center glass rounded-2xl border-dashed">
                  <Mail size={32} className="mb-4 opacity-20" />
                  <p className="font-medium italic opacity-50">Your inbox is empty. Waiting for incoming mail...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group flex justify-between items-center bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 p-6 rounded-2xl cursor-pointer transition-all shadow-lg"
                      onClick={() => openMessage(msg.id)}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold border border-primary/20">
                          {msg.from.name ? msg.from.name[0].toUpperCase() : 'M'}
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-white text-lg">
                            {msg.subject || '(No Subject)'}
                          </span>
                          <span className="text-sm text-text-muted">
                            From: <span className="text-indigo-300">{msg.from.address}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        View Message
                        <ChevronRight size={18} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      {/* FAQ Section */}
      <section className="relative z-10 max-w-3xl mx-auto py-24 px-6">
        <h2 className="text-3xl font-extrabold text-center text-white mb-12 tracking-tight">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQ_DATA.map((item, idx) => (
            <div
              key={idx}
              className={`glass rounded-2xl overflow-hidden transition-all duration-500 ${
                activeFaq === idx ? 'ring-1 ring-primary/50' : ''
              }`}
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center p-6 text-left font-bold text-white hover:bg-white/5 transition-colors"
              >
                {item.question}
                <ChevronDown
                  size={20}
                  className={`text-text-muted transition-transform duration-300 ${
                    activeFaq === idx ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  activeFaq === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 text-text-muted text-sm leading-relaxed border-t border-white/5">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-10 py-6 flex justify-between items-center text-[10px] text-slate-500 border-t border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex gap-6 uppercase tracking-widest font-bold">
          <span className="hover:text-white transition-colors cursor-default underline decoration-primary/50 underline-offset-4">Encrypted Channel</span>
          <span className="hover:text-white transition-colors cursor-default underline decoration-primary/50 underline-offset-4">Privacy Guaranteed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
          <span className="uppercase tracking-widest font-bold">EST. 2024 — INSTANTMAIL LABS</span>
        </div>
      </footer>

      {/* Message Modal */}
      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-bg-dark/80 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-4xl max-h-[90vh] glass rounded-[40px] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start p-8 md:p-10 border-b border-white/10">
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-3">
                  {selectedMessage.subject || '(No Subject)'}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
                  <span className="font-bold text-indigo-400">From:</span>
                  <span className="text-white font-semibold">{selectedMessage.from.name || selectedMessage.from.address}</span>
                  <span className="opacity-40">&lt;{selectedMessage.from.address}&gt;</span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white border border-white/10"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white/5">
              <div className="bg-white rounded-3xl overflow-hidden min-h-[450px] shadow-inner">
                {selectedMessage.html && selectedMessage.html.length > 0 ? (
                  <iframe
                    title="email-content"
                    srcDoc={selectedMessage.html[0]}
                    className="w-full h-[500px] border-none"
                  />
                ) : (
                  <div className="p-10 whitespace-pre-line text-slate-800 font-medium leading-relaxed bg-white">
                    {selectedMessage.text}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
