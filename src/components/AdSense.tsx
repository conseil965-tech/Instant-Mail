import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Mail, Sparkles, Award } from 'lucide-react';

interface AdSenseProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  theme?: 'light' | 'dark';
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// Custom tips/promos to show when AdSense is blocked (prevents empty spaces)
const FALLBACK_TIPS = [
  {
    icon: <ShieldCheck className="text-emerald-500 w-5 h-5" />,
    title: "Mails.org Premium",
    text: "Protégez votre boîte mail principale des spams, traceurs et bases de données publicitaires."
  },
  {
    icon: <Mail className="text-blue-500 w-5 h-5" />,
    title: "Emails Temporaires Illimités",
    text: "Générez de nouvelles adresses en 1 clic pour tester des applications, newsletters et forums."
  },
  {
    icon: <Sparkles className="text-violet-500 w-5 h-5" />,
    title: "Générateur de CV Intégré",
    text: "Besoin de postuler ? Utilisez notre outil de création de CV aux normes internationales !"
  },
  {
    icon: <Award className="text-amber-500 w-5 h-5" />,
    title: "Anonymat Garanti",
    text: "Aucun historique, aucune donnée personnelle requise. Votre sécurité est notre priorité absolue."
  }
];

export function AdSense({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style = {},
  theme = 'dark'
}: AdSenseProps) {
  const [isIntersected, setIsIntersected] = useState(false);
  const [isAdBlockerActive, setIsAdBlockerActive] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pick a random tip to show when AdSense is blocked/disabled
  const [fallbackTip] = useState(() => {
    const randomIndex = Math.floor(Math.random() * FALLBACK_TIPS.length);
    return FALLBACK_TIPS[randomIndex];
  });

  // Calculate reserved height to completely eliminate CLS (Cumulative Layout Shift)
  const getReservedHeight = () => {
    if (format === 'horizontal') {
      return { minHeight: '90px', maxHeight: '140px' };
    }
    if (format === 'rectangle') {
      return { minHeight: '250px', maxHeight: '310px' };
    }
    if (format === 'vertical') {
      return { minHeight: '600px', maxHeight: '640px' };
    }
    return { minHeight: '100px', maxHeight: '150px' };
  };

  useEffect(() => {
    // Robust IntersectionObserver for high performance lazy-loading
    // We observe with rootMargin of '250px' to fetch ads just before they scroll into viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersected(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '250px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isIntersected) return;

    // Detect if Google AdSense script has been blocked or if it fails to initialize after 3.5 seconds
    const adBlockTimer = setTimeout(() => {
      const isScriptAvailable = typeof window !== 'undefined' && window.adsbygoogle;
      if (!isScriptAvailable || !isInitialized) {
        setIsAdBlockerActive(true);
      }
    }, 3500);

    // Initialize adsbygoogle
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
          setIsInitialized(true);
        }
      } catch (e) {
        console.debug('AdSense initialization error (likely AdBlocker):', e);
        setIsAdBlockerActive(true);
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      clearTimeout(adBlockTimer);
    };
  }, [isIntersected, isInitialized]);

  const sizes = getReservedHeight();

  // If AdBlocker is active or script loading failed, render a premium discrete local layout block
  // This satisfies "pas de grands espaces vides" and keeps the look extremely premium and helpful
  if (isAdBlockerActive) {
    return (
      <div
        className={`w-full overflow-hidden flex flex-col justify-between transition-all duration-500 rounded-2xl border ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-white/[0.01] to-white/[0.03] border-white/5 text-slate-300'
            : 'bg-gradient-to-br from-black/[0.01] to-black/[0.02] border-black/5 text-slate-700'
        } ${className}`}
        style={{
          minHeight: sizes.minHeight,
          ...style
        }}
      >
        <div className={`text-[8px] font-bold tracking-[0.2em] uppercase py-2 px-4 border-b flex justify-between items-center ${
          theme === 'dark' ? 'text-slate-500 border-white/5 bg-white/[0.01]' : 'text-slate-400 border-black/5 bg-black/[0.01]'
        }`}>
          <span>Mails.org Premium</span>
          <span className="opacity-60">Sponsorisé</span>
        </div>
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-4 p-5 sm:p-6 justify-center">
          <div className={`p-3 rounded-xl flex items-center justify-center ${
            theme === 'dark' ? 'bg-white/5 text-white/90' : 'bg-black/5 text-slate-800'
          }`}>
            {fallbackTip.icon}
          </div>
          <div className="text-center sm:text-left">
            <h4 className={`text-xs font-black uppercase tracking-wider mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              {fallbackTip.title}
            </h4>
            <p className={`text-[11px] leading-relaxed max-w-lg ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {fallbackTip.text}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`adsense-container w-full overflow-hidden flex flex-col justify-start transition-all duration-500 rounded-2xl border ${
        theme === 'dark'
          ? 'bg-white/[0.01] hover:bg-white/[0.02] border-white/5'
          : 'bg-black/[0.01] hover:bg-black/[0.02] border-black/5'
      } ${className}`}
      style={{
        minHeight: sizes.minHeight,
        ...style
      }}
    >
      <div className={`text-[8px] font-bold tracking-[0.2em] uppercase py-2 px-4 border-b w-full flex justify-between items-center ${
        theme === 'dark'
          ? 'text-slate-500 border-white/5 bg-white/[0.01]'
          : 'text-slate-400 border-black/5 bg-black/[0.01]'
      }`}>
        <span>Publicité</span>
        <span className="opacity-50">Sponsorisé</span>
      </div>
      
      <div className="w-full flex justify-center items-center p-4">
        {isIntersected ? (
          <ins
            className="adsbygoogle"
            style={{
              display: 'block',
              width: '100%',
              minHeight: '50px',
              ...style
            }}
            data-ad-client="ca-pub-5082705071339976"
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive={responsive ? "true" : "false"}
          />
        ) : (
          <div className="h-14 flex flex-col items-center justify-center gap-1.5 py-4">
            <span className={`text-[9px] font-bold tracking-widest uppercase animate-pulse ${
              theme === 'dark' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Chargement de l'annonce...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

