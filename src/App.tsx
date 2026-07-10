/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Mail, RefreshCw, Trash2, Copy, Check, ChevronRight, Loader2, X, ChevronDown, AlertCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { mailTmService } from './lib/mail-tm';
import { Account, Message, FAQItem } from './types';
import { AdSensePlaceholder } from './components/AdSense';

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
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 0.7 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="w-full h-full"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://res.cloudinary.com/ensdqbmy/video/upload/v1783680734/Icy_blue_envelope_rotates_spins_202607100944_vrkyfh.mp4" type="video/mp4" />
          </video>
        </motion.div>
        
        {/* Dynamic Overlays for depth and readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/80 via-bg-dark/40 to-bg-dark/90 backdrop-blur-[3px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
      </div>

      {/* Abstract Background Elements (Backups/Accents) */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="relative z-50 px-6 md:px-12 py-8 flex justify-between items-center max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <Mail className="text-white" size={28} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            Instant<span className="text-indigo-400">Mail</span>
          </span>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-lg">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
            <span className="text-[11px] font-black text-green-400 uppercase tracking-[0.2em]">Secure Node 01</span>
          </div>
        </motion.div>
      </nav>

      {/* Ad: Under Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-12">
        <AdSensePlaceholder type="horizontal" />
      </div>

      {/* Hero Section */}
      <main className="relative z-10 px-6 md:px-12 py-12 text-center overflow-visible">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tightest mb-6 text-white leading-none">
            Your Private <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Digital Shield</span>
          </h1>
          <p className="text-text-muted text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Generate instant disposable email addresses. Protect your identity, block tracking, and experience a cleaner internet.
          </p>

          {/* Ad: After First Paragraph */}
          <div className="mt-12 max-w-4xl mx-auto">
            <AdSensePlaceholder type="horizontal" label="Google AdSense - Priority Placement" />
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          {/* Main content grid col */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-12">
            {/* Main Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="glass rounded-[48px] p-8 md:p-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/5"
            >
          {/* Email Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400 text-sm font-bold flex items-center justify-center gap-3"
            >
              <AlertCircle size={20} />
              {error}
            </motion.div>
          )}
          
          <div className="group relative bg-black/40 border border-white/10 rounded-[32px] p-3 mb-10 shadow-2xl transition-all duration-500 hover:border-indigo-500/30 hover:bg-black/60">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[36px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <input
              type="text"
              readOnly
              value={isLoading ? "SECURELY GENERATING..." : account?.address || ""}
              className="relative w-full bg-transparent border-none outline-none px-8 py-6 text-3xl md:text-4xl font-mono font-black text-indigo-200 text-center tracking-tight"
              placeholder="INITIALIZING..."
            />
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap justify-center gap-5 mb-16">
            <button
              onClick={copyToClipboard}
              disabled={isLoading || !account}
              className="flex items-center gap-3 px-8 py-5 bg-indigo-600 rounded-[24px] text-white font-black hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-indigo-600/20"
            >
              {copied ? <Check size={22} /> : <Copy size={22} />}
              {copied ? "COPIED" : "COPY ADDRESS"}
            </button>
            <button
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              className="px-8 py-5 bg-white/5 border border-white/10 rounded-[24px] text-white font-black hover:bg-white/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
            >
              <RefreshCw size={22} className={`${isRefreshing ? "animate-spin" : "text-indigo-400"}`} />
              REFRESH
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="px-8 py-5 bg-white/5 border border-white/10 rounded-[24px] text-white font-black hover:bg-red-500/10 hover:border-red-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 group"
            >
              <Trash2 size={22} className="text-red-400 group-hover:scale-110 transition-transform" />
              NEW SESSION
            </button>
          </div>

          {/* Ad: Middle of Content */}
          <div className="mb-16">
            <AdSensePlaceholder type="rectangle" label="Google AdSense - Engagement Block" />
          </div>

          {/* Inbox Area */}
          <div className="text-left border-t border-white/5 pt-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
              <h2 className="text-3xl font-black text-white flex items-center gap-4">
                <div className="w-1.5 h-8 bg-indigo-500 rounded-full"></div>
                Incoming Feed
              </h2>
              <div className="flex items-center gap-4 bg-white/5 px-5 py-2.5 rounded-2xl border border-white/5 shadow-inner">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Status</span>
                  <span className="text-xs text-white font-mono">
                    {retryAfter > 0 ? `RETRYING IN ${retryAfter}S` : "LISTENING..."}
                  </span>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Count</span>
                  <span className="text-xs text-indigo-400 font-black">{messages.length} ACTIVE</span>
                </div>
              </div>
            </div>

            <div className="min-h-[300px] relative">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 text-text-muted">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="font-black tracking-widest text-xs uppercase">Establishing Encrypted Tunnel</p>
                </div>
              ) : messages.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-24 text-text-muted text-center bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[32px]"
                >
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Mail size={40} className="opacity-20" />
                  </div>
                  <p className="font-bold text-lg text-white/40 italic">Waiting for the first incoming packet...</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-5">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative flex justify-between items-center bg-white/[0.03] border border-white/5 hover:bg-white/10 hover:border-white/10 p-8 rounded-[32px] cursor-pointer transition-all duration-500 shadow-xl overflow-hidden"
                      onClick={() => openMessage(msg.id)}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center text-indigo-300 font-black text-2xl border border-indigo-500/20 shadow-lg">
                          {msg.from.name ? msg.from.name[0].toUpperCase() : 'M'}
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="font-black text-white text-xl tracking-tight group-hover:text-indigo-300 transition-colors">
                            {msg.subject || '(No Subject)'}
                          </span>
                          <span className="text-sm font-medium text-text-muted">
                            <span className="opacity-50">From:</span> <span className="text-indigo-400/70">{msg.from.address}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-indigo-400 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                        Decrypt
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sidebar Ad (Visible only on desktop) */}
      <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-8"
        >
          <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] backdrop-blur-2xl">
            <h4 className="text-xs font-black text-text-muted uppercase tracking-[0.3em] mb-6">Security Partner</h4>
            <AdSensePlaceholder type="vertical" label="Google AdSense - Sidebar Premium" />
          </div>
          <AdSensePlaceholder type="rectangle" label="Google AdSense - Sidebar Secondary" />
        </motion.div>
      </aside>
    </div>
  </main>

  {/* Ad: Before Footer */}
  <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
    <AdSensePlaceholder type="horizontal" label="Google AdSense - Bottom" />
  </div>

  {/* FAQ Section */}
      <section className="relative z-10 max-w-4xl mx-auto py-32 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tightest uppercase">Common Inquiries</h2>
          <p className="text-text-muted font-medium">Everything you need to know about our secure temporary mail service.</p>
        </motion.div>
        
        <div className="space-y-6">
          {FAQ_DATA.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`glass rounded-[32px] overflow-hidden transition-all duration-500 border border-white/5 ${
                activeFaq === idx ? 'ring-2 ring-indigo-500/30 bg-white/[0.07]' : 'hover:bg-white/[0.03]'
              }`}
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center p-8 md:p-10 text-left font-black text-white transition-colors group"
              >
                <span className="text-lg md:text-xl tracking-tight group-hover:text-indigo-300 transition-colors">{item.question}</span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  activeFaq === idx ? 'bg-indigo-500 text-white rotate-180' : 'bg-white/5 text-text-muted'
                }`}>
                  <ChevronDown size={20} />
                </div>
              </button>
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  activeFaq === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-8 md:p-10 pt-0 text-text-muted text-lg leading-relaxed border-t border-white/5 font-medium">
                  {item.answer}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 py-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] text-slate-500 border-t border-white/5 bg-black/40 backdrop-blur-3xl">
        <div className="flex flex-wrap justify-center gap-8 uppercase tracking-[0.3em] font-black">
          <span className="hover:text-white transition-colors cursor-default flex items-center gap-2">
            <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
            AES-256 Encryption
          </span>
          <span className="hover:text-white transition-colors cursor-default flex items-center gap-2">
            <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
            Zero-Log Policy
          </span>
          <span className="hover:text-white transition-colors cursor-default flex items-center gap-2">
            <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
            GDPR Compliant
          </span>
        </div>
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.8)] animate-pulse"></div>
            <span className="uppercase tracking-[0.2em] font-black text-white">System Status: Optimal</span>
          </div>
          <span className="uppercase tracking-widest font-bold opacity-30 mt-2">© 2026 INSTANTMAIL LABS — QUANTUM PRIVACY ENGINE</span>
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
