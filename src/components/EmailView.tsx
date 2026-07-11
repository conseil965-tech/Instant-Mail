import { 
  Mail, 
  Copy, 
  RefreshCw, 
  Trash2, 
  Loader2, 
  ChevronRight, 
  ChevronDown,
  Settings,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Account, Message, FAQItem } from '../types';


const FAQ_DATA: FAQItem[] = [
  {
    question: "Qu'est-ce qu'un email temporaire gratuit ?",
    answer: "Un email temporaire gratuit est un moyen sécurisé et anonyme d'agir en ligne sans risquer votre email réel. Idéal pour les inscriptions, téléchargements ou connexions sans spam ni problèmes de confidentialité. Sans données personnelles ni inscription requises, vous pouvez recevoir emails et pièces jointes. Les messages sont supprimés automatiquement, sans laisser de trace."
  },
  {
    question: "Quelle est la durée d'un email temporaire ?",
    answer: "Votre adresse est active tant que vous gardez votre session ouverte. Notre système est conçu pour un usage éphémère et sécurisé."
  },
  {
    question: "Puis-je choisir ma propre adresse temporaire ?",
    answer: "Oui, notre système vous permet de générer des adresses aléatoires ou de rafraîchir pour en obtenir une nouvelle instantanément."
  },
  {
    question: "Est-ce sûr d'utiliser un email temporaire pour s'inscrire ?",
    answer: "Absolument. C'est l'un des meilleurs moyens de protéger votre boîte mail principale du spam et des fuites de données potentielles sur des sites tiers."
  },
  {
    question: "Combien d'emails temporaires puis-je créer ?",
    answer: "Il n'y a pas de limite stricte. Vous pouvez générer autant de nouvelles adresses que nécessaire pour vos besoins de navigation."
  }
];

interface EmailViewProps {
  theme: 'light' | 'dark';
  account: Account | null;
  messages: Message[];
  isLoading: boolean;
  isRefreshing: boolean;
  copied: boolean;
  copyToClipboard: () => void;
  handleRefresh: () => void;
  handleDelete: () => void;
  openMessage: (id: string) => void;
  activeFaq: number | null;
  setActiveFaq: (idx: number | null) => void;
}

export function EmailView({
  theme,
  account,
  messages,
  isLoading,
  isRefreshing,
  copied,
  copyToClipboard,
  handleRefresh,
  handleDelete,
  openMessage,
  activeFaq,
  setActiveFaq
}: EmailViewProps) {
  return (
    <>
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-32">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-start mb-16 sm:mb-24">
          <div className="text-left pt-2">
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 tracking-wide uppercase leading-tight transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Email Temporaire Gratuit
            </h1>
            <p className={`text-sm sm:text-base leading-relaxed max-w-md mb-6 sm:mb-8 transition-colors ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Bouclier de confidentialité en ligne. Obtenez instantanément des adresses email temporaires, sûres et anonymes. Idéal pour s'inscrire sans exposer votre email réel, éviter le spam et protéger votre vie privée.
            </p>
          </div>

          {/* Action Bar */}
          <div className="space-y-4 sm:space-y-6">
            <div className={`flex items-center border rounded-2xl p-1.5 sm:p-2 shadow-2xl group focus-within:border-blue-500/50 transition-all ${
              theme === 'dark' ? 'bg-[#0d1117] border-white/10' : 'bg-white border-black/10'
            }`}>
              <input
                type="text"
                readOnly
                value={isLoading ? "Génération..." : account?.address || ""}
                className={`flex-1 bg-transparent border-none outline-none px-4 sm:px-6 py-3 sm:py-4 text-lg sm:text-xl font-medium tracking-tight transition-colors ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              />
              <button 
                onClick={copyToClipboard}
                className={`p-2 sm:p-3 transition-colors ${
                  theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'
                }`}
                title="Copier"
              >
                <Copy size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <button 
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                <span className="text-xs sm:text-sm uppercase tracking-wider">{copied ? "Copié !" : "Copier"}</span>
              </button>
              <button 
                onClick={handleRefresh}
                className={`flex items-center justify-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border font-bold rounded-xl transition-all active:scale-95 ${
                  theme === 'dark' 
                    ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' 
                    : 'bg-black/5 hover:bg-black/10 border-black/10 text-slate-900'
                }`}
              >
                <Settings size={18} className={isRefreshing ? "animate-spin" : ""} />
                <span className="text-xs sm:text-sm uppercase tracking-wider">Paramètres</span>
              </button>
              <button 
                onClick={handleDelete}
                className={`flex items-center justify-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border font-bold rounded-xl transition-all active:scale-95 ${
                  theme === 'dark' 
                    ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' 
                    : 'bg-black/5 hover:bg-black/10 border-black/10 text-slate-900'
                }`}
              >
                <Trash2 size={18} />
                <span className="text-xs sm:text-sm uppercase tracking-wider">Supprimer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 mb-16 sm:mb-24">
          <div className="lg:col-span-8 space-y-8 sm:space-y-10">
            <div className={`backdrop-blur-3xl border rounded-3xl min-h-[400px] sm:min-h-[600px] overflow-hidden flex flex-col shadow-2xl transition-all ${
              theme === 'dark' ? 'bg-[#0d1117]/60 border-white/5' : 'bg-white/80 border-black/5'
            }`}>
              <div className={`flex items-center justify-between px-6 sm:px-8 py-4 sm:py-5 border-b transition-colors ${
                theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-black/[0.02]'
              }`}>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-blue-400 sm:w-4 sm:h-4" />
                  <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>Boîte de réception</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                  <span className={`text-[8px] sm:text-[10px] uppercase font-black tracking-widest transition-colors ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                  }`}>En direct</span>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 text-center">
                {isLoading ? (
                  <div className="space-y-4">
                    <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 animate-spin mx-auto" />
                    <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${
                      theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                    }`}>Sécurisation du tunnel...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="max-w-xs space-y-4 sm:space-y-6">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto transition-colors ${
                      theme === 'dark' ? 'bg-white/5' : 'bg-black/5'
                    }`}>
                      <Mail size={24} className={theme === 'dark' ? 'text-slate-700' : 'text-slate-300'} />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <h3 className={`text-lg sm:text-xl font-bold transition-colors ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>En attente emails</h3>
                      <p className={`text-xs sm:text-sm leading-relaxed transition-colors ${
                        theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                      }`}>Les nouveaux messages apparaîtront automatiquement ici.</p>
                    </div>
                    <div className={`flex items-center justify-center gap-3 text-[8px] sm:text-[10px] font-bold uppercase py-3 sm:py-4 border-t transition-colors ${
                      theme === 'dark' ? 'text-slate-600 border-white/5' : 'text-slate-400 border-black/5'
                    }`}>
                      <span className="tracking-widest">Nettoyage automatique actif</span>
                      <Settings size={12} className="opacity-50" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full space-y-3 px-2 sm:px-4">
                    {messages.map((msg, idx) => (
                      <motion.div 
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-4 sm:p-6 rounded-2xl cursor-pointer transition-all border flex justify-between items-center group shadow-lg ${
                          theme === 'dark' 
                            ? 'bg-white/[0.03] hover:bg-white/[0.06] border-transparent hover:border-white/10' 
                            : 'bg-black/[0.02] hover:bg-black/[0.04] border-transparent hover:border-black/5'
                        }`}
                        onClick={() => openMessage(msg.id)}
                      >
                        <div className="text-left flex items-center gap-3 sm:gap-6">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold border transition-colors flex-shrink-0 ${
                            theme === 'dark' 
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                              : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                          }`}>
                            {msg.from.name ? msg.from.name[0].toUpperCase() : 'M'}
                          </div>
                          <div className="space-y-0.5 sm:space-y-1 min-w-0">
                            <div className={`font-bold text-base sm:text-lg group-hover:text-blue-400 transition-colors truncate ${
                              theme === 'dark' ? 'text-white' : 'text-slate-900'
                            }`}>{msg.subject || "(Sans objet)"}</div>
                            <div className={`text-[10px] sm:text-xs font-medium transition-colors truncate ${
                              theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                            }`}>De: <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>{msg.from.address}</span></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          <span className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-widest hidden md:block transition-colors ${
                            theme === 'dark' ? 'text-slate-600' : 'text-slate-400'
                          }`}>Consulter</span>
                          <ChevronRight size={16} className={`transition-all group-hover:translate-x-1 sm:w-5 sm:h-5 ${
                            theme === 'dark' ? 'text-slate-600 group-hover:text-blue-400' : 'text-slate-400 group-hover:text-blue-500'
                          }`} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            

          </div>

          <aside className="lg:col-span-4 space-y-8 sm:space-y-10">
            <div className="lg:sticky lg:top-10 space-y-8 sm:space-y-10">

              <div className={`border p-6 sm:p-8 rounded-3xl space-y-4 sm:space-y-6 backdrop-blur-md transition-all ${
                theme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-black/[0.02] border-black/5'
              }`}>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors ${
                  theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-500/10 text-blue-600'
                }`}>
                  <Mail size={18} className="sm:w-5 sm:h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>Conseil Sécurité</h4>
                  <p className={`text-xs sm:text-sm leading-relaxed font-medium transition-colors ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
                  }`}>Utilisez une adresse différente pour chaque site afin de tracer précisément l'origine des spams.</p>
                </div>
                <button className={`w-full py-2.5 sm:py-3 rounded-xl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all ${
                  theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-slate-400' : 'bg-black/5 hover:bg-black/10 text-slate-600'
                }`}>En savoir plus</button>
              </div>
            </div>
          </aside>
        </div>

        {/* FAQ Section */}
        <section className="mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-2xl font-bold uppercase tracking-[0.3em] mb-4 transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>Questions Fréquemment Posées</h2>
            <div className="w-20 h-1 bg-blue-500/30 mx-auto rounded-full"></div>
          </motion.div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {FAQ_DATA.map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`border rounded-2xl overflow-hidden transition-all ${
                  theme === 'dark' ? 'bg-white/[0.01] border-white/5 hover:bg-white/[0.02]' : 'bg-black/[0.01] border-black/5 hover:bg-black/[0.02]'
                }`}
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center gap-6 p-8 text-left transition-colors group"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                    activeFaq === idx ? 'bg-blue-500 text-white rotate-180' : (theme === 'dark' ? 'bg-white/5 text-slate-600' : 'bg-black/5 text-slate-400')
                  }`}>
                    <ChevronDown size={18} />
                  </div>
                  <span className={`text-base font-bold group-hover:text-blue-500 transition-colors tracking-tight ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>{item.question}</span>
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`px-20 pb-10 text-base leading-relaxed font-medium transition-colors ${
                        theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
                      }`}
                    >
                      {item.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
