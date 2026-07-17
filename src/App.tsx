import { 
  Globe,
  Moon,
  Sun,
  ChevronDown,
  X,
  Mail,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { mailTmService } from './lib/mail-tm';
import { Account, Message } from './types';
import { EmailView } from './components/EmailView';
import { CVGenerator } from './components/CVGenerator';
import { AdSense } from './components/AdSense';

export default function App() {
  const [view, setView] = useState<'emails' | 'cv'>('emails');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('mails_org_theme');
    return (saved as 'light' | 'dark') || 'dark';
  });
  const [account, setAccount] = useState<Account | null>(() => {
    const saved = localStorage.getItem('instantmail_account');
    return saved ? JSON.parse(saved) : null;
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  useEffect(() => {
    localStorage.setItem('mails_org_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const initAccount = useCallback(async () => {
    try {
      setIsLoading(true);
      const domains = await mailTmService.getDomains();
      if (!domains || domains.length === 0) throw new Error('No domains available');
      
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
      localStorage.setItem('instantmail_account', JSON.stringify(newAccount));
      setMessages([]);
    } catch (err) {
      console.error("Failed to create account:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!account) {
      initAccount();
    }
  }, [account, initAccount]);

  const fetchMessages = useCallback(async () => {
    if (!account?.token) return;
    try {
      const newMessages = await mailTmService.getMessages(account.token);
      setMessages(newMessages);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
    }
  }, [account]);

  useEffect(() => {
    if (!account?.token) return;
    const interval = setInterval(fetchMessages, 15000);
    fetchMessages();
    return () => clearInterval(interval);
  }, [account, fetchMessages]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchMessages();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleDelete = () => {
    localStorage.removeItem('instantmail_account');
    setAccount(null);
    setMessages([]);
    initAccount();
  };

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
    } catch (err) {
      console.error('Error opening message:', err);
    }
  };

  return (
    <div className={`relative min-h-screen transition-colors duration-500 font-sans selection:bg-blue-500/30 ${
      theme === 'dark' ? 'bg-[#0a0c10] text-slate-300' : 'bg-slate-50 text-slate-600'
    }`}>
      {/* Background Video */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: theme === 'dark' ? 0.35 : 0.15 }}
          transition={{ duration: 2.5 }}
          className="w-full h-full"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105"
          >
            <source src="https://res.cloudinary.com/ensdqbmy/video/upload/v1783680734/Icy_blue_envelope_rotates_spins_202607100944_vrkyfh.mp4" type="video/mp4" />
          </video>
        </motion.div>
        <div className={`absolute inset-0 transition-colors duration-500 ${
          theme === 'dark' 
            ? 'bg-gradient-to-b from-[#0a0c10]/95 via-[#0a0c10]/60 to-[#0a0c10]' 
            : 'bg-gradient-to-b from-white/90 via-white/40 to-white'
        }`}></div>
      </div>

      {/* Header Navigation */}
      <header className="relative z-50 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => setView('emails')}>
          <img 
            src="/logo_pro.jpg" 
            alt="Mails.org Logo" 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl shadow-2xl shadow-blue-500/20"
            referrerPolicy="no-referrer"
          />
          <span className={`text-xl sm:text-2xl font-bold tracking-tight transition-colors ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Mails<span className="text-blue-400">.org</span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Main Navigation Tabs */}
          <nav className={`flex items-center gap-1 p-1 rounded-2xl border backdrop-blur-xl transition-all ${
            theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
          }`}>
            <button 
              onClick={() => setView('emails')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                view === 'emails' 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                  : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Mail size={14} />
              <span className="hidden sm:inline">Emails</span>
            </button>
            <button 
              onClick={() => setView('cv')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                view === 'cv' 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                  : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText size={14} />
              <span className="hidden sm:inline">Créer un CV</span>
              <span className="sm:hidden text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">Pro</span>
            </button>
          </nav>

          <div className={`flex items-center gap-2 sm:gap-4 backdrop-blur-xl px-3 sm:px-4 py-2 rounded-full border shadow-lg transition-all ${
            theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
          }`}>
            <div 
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-1 sm:px-2 cursor-pointer transition-colors ${
                theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'
              }`}
            >
              {theme === 'dark' ? <Moon size={14} className="sm:w-4 sm:h-4" /> : <Sun size={14} className="sm:w-4 sm:h-4 text-amber-500" />}
              <div className={`w-7 h-3.5 sm:w-8 sm:h-4 rounded-full relative transition-colors ${
                theme === 'dark' ? 'bg-white/10' : 'bg-black/10'
              }`}>
                <motion.div 
                  animate={{ x: theme === 'dark' ? 14 : 0 }}
                  className={`absolute left-0.5 top-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors ${
                    theme === 'dark' ? 'bg-white' : 'bg-blue-500'
                  }`}
                />
              </div>
            </div>
            <div className={`w-px h-4 ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`}></div>
            <div className={`flex items-center gap-1 sm:gap-2 px-1 sm:px-2 text-[10px] sm:text-xs font-bold transition-colors cursor-pointer ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              <Globe size={12} className="sm:w-[14px] sm:h-[14px]" />
              <span className="hidden xs:inline">FR</span>
              <ChevronDown size={12} className="sm:w-[14px] sm:h-[14px]" />
            </div>
          </div>
        </div>
      </header>

      {/* HEADER ADS */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-6">
        <AdSense slot="8881234567" format="horizontal" theme={theme} />
      </div>
      {/* HEADER ADS END */}

      {/* Dynamic View Content */}
      <AnimatePresence mode="wait">
        {view === 'emails' ? (
          <motion.div
            key="emails"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <EmailView 
              theme={theme}
              account={account}
              messages={messages}
              isLoading={isLoading}
              isRefreshing={isRefreshing}
              copied={copied}
              copyToClipboard={copyToClipboard}
              handleRefresh={handleRefresh}
              handleDelete={handleDelete}
              openMessage={openMessage}
              activeFaq={activeFaq}
              setActiveFaq={setActiveFaq}
            />
          </motion.div>
        ) : (
          <motion.div
            key="cv"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 pb-20"
          >
            <CVGenerator />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER ADS */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mt-12 mb-6">
        <AdSense slot="8884567890" format="horizontal" theme={theme} />
      </div>
      {/* FOOTER ADS END */}

      {/* Footer */}
      <footer className={`relative z-10 max-w-6xl mx-auto px-6 py-12 border-t flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${
        theme === 'dark' ? 'text-slate-600 border-white/5' : 'text-slate-400 border-black/5'
      }`}>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <span>© Copyright <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Mails.org</span>. All Rights Reserved</span>
          <div className={`hidden md:block w-px h-3 ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`}></div>
          <span className="opacity-40">Privacy First Engine v2.4</span>
        </div>
        <div className="flex gap-8">
          <a href="#" className={`transition-colors border-b border-transparent hover:border-blue-500 pb-1 ${
            theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'
          }`}>Status page</a>
          <a href="#" className={`transition-colors border-b border-transparent hover:border-blue-500 pb-1 ${
            theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'
          }`}>Politique de confidentialité</a>
        </div>
      </footer>

      {/* Modal Message View (Only for Emails) */}
      <AnimatePresence>
        {isModalOpen && selectedMessage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0a0c10]/90 backdrop-blur-2xl"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className={`relative w-full max-w-5xl max-h-[90vh] sm:max-h-[85vh] border rounded-[24px] sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden transition-colors ${
                theme === 'dark' ? 'bg-[#0d1117] border-white/10' : 'bg-white border-black/10'
              }`}
            >
              {/* Modal Header */}
              <div className={`flex justify-between items-start p-6 sm:p-10 border-b transition-colors ${
                theme === 'dark' ? 'border-white/5 bg-white/[0.01]' : 'border-black/5 bg-black/[0.01]'
              }`}>
                <div className="space-y-2 sm:space-y-4 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-500/10 rounded-full text-[8px] sm:text-[10px] font-black text-blue-400 uppercase tracking-widest border border-blue-500/20">
                      Incoming Secure
                    </div>
                    <span className={`text-[8px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${
                      theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                    }`}>ID: {selectedMessage.id.substring(0, 8)}</span>
                  </div>
                  <h3 className={`text-xl sm:text-3xl font-black tracking-tight leading-tight transition-colors truncate ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {selectedMessage.subject || '(Sans objet)'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium">
                    <span className={theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}>Expéditeur:</span>
                    <span className="text-blue-500 truncate max-w-[200px]">{selectedMessage.from.name || selectedMessage.from.address}</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`p-2 sm:p-4 rounded-xl sm:rounded-2xl transition-all border shadow-lg group ${
                    theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-white border-white/10' : 'bg-black/5 hover:bg-black/10 text-slate-900 border-black/10'
                  }`}
                >
                  <X size={20} className="group-hover:rotate-90 transition-transform duration-500 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-10 bg-white">
                <div className="min-h-[300px] sm:min-h-[400px]">
                  {selectedMessage.html && selectedMessage.html.length > 0 ? (
                    <iframe
                      title="email-content"
                      srcDoc={selectedMessage.html[0]}
                      className="w-full h-[400px] sm:h-[500px] border-none"
                    />
                  ) : (
                    <div className="whitespace-pre-line text-slate-800 font-medium text-base sm:text-lg leading-relaxed">
                      {selectedMessage.text}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className={`p-6 sm:p-8 border-t flex justify-between items-center transition-colors ${
                theme === 'dark' ? 'border-white/5 bg-white/[0.01]' : 'border-black/5 bg-black/[0.01]'
              }`}>
                <div className="flex items-center gap-2 text-[8px] sm:text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Chiffré
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-xs sm:text-sm uppercase tracking-widest transition-all"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
