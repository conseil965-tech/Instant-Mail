import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, Layout, User, Briefcase, GraduationCap, Mail, X, Trash2, Sparkles, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdSensePlaceholder } from './AdSense';
// @ts-ignore - html2pdf.js doesn't have official types
import html2pdf from 'html2pdf.js';

interface CVData {
  name: string;
  title: string;
  contact: string;
  profile: string;
  experience: string;
  education: string;
}

export function CVGenerator() {
  const [template, setTemplate] = useState('1');
  const [data, setData] = useState<CVData>({
    name: '',
    title: '',
    contact: '',
    profile: '',
    experience: '',
    education: '',
  });

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [mobileContainerWidth, setMobileContainerWidth] = useState(360);
  const [isAutoZoom, setIsAutoZoom] = useState(true);
  const [manualZoom, setManualZoom] = useState(0.75);

  const cvRef = useRef<HTMLDivElement>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  useEffect(() => {
    if (!previewContainerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    resizeObserver.observe(previewContainerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileContainerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width > 0) {
          setMobileContainerWidth(entry.contentRect.width);
        }
      }
    });
    resizeObserver.observe(mobileContainerRef.current);
    return () => resizeObserver.disconnect();
  }, [showMobilePreview]);

  const autoZoomLevel = Math.max(0.3, Math.min(1.2, (containerWidth - 48) / 794));
  const zoom = isAutoZoom ? autoZoomLevel : manualZoom;
  const mobileZoom = Math.max(0.25, Math.min(1.0, (mobileContainerWidth - 32) / 794));

  // Auto-resize textareas based on content to make all letters/text always visible
  useEffect(() => {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }, [data]);

  const handleDownload = () => {
    if (!cvRef.current) return;
    
    const opt = {
      margin: 0,
      filename: `CV_${(data.name.trim() || 'Mon_CV').replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };
    
    html2pdf().set(opt).from(cvRef.current).save();
  };

  const templates = [
    { id: '1', name: 'Moderne Corporate (Bleu)' },
    { id: '2', name: 'Minimaliste Chic (Lettres)' },
    { id: '3', name: 'Créatif Épuré (Violet)' },
    { id: '4', name: 'Élégance (Bordeaux)' },
    { id: '5', name: 'Exécutif (Gris & Or)' },
    { id: '6', name: 'Compact Tech (Noir)' },
    { id: '7', name: 'Esprit Startup (Vert)' },
    { id: '8', name: 'Modèle Sombre (Dark Mode)' },
    { id: '9', name: 'Double Colonne Symétrique' },
    { id: '10', name: 'Classique Épuré (Rouge)' },
  ];

  const renderCV = () => {
    const name = data.name.trim() || 'Jean Dupont';
    const title = data.title.trim() || 'Développeur Web Full Stack';
    const contact = data.contact.trim() || '+33 6 12 34 56 78 | jean.dupont@email.com | Paris, France';
    const profile = data.profile.trim() || "Développeur passionné avec 4 ans d'expérience dans la création d'applications web modernes et performantes.";
    const experience = data.experience.trim() || "2024 - Présent : Développeur Senior | Tech Solutions\n• Gestion d'une équipe de 3 développeurs.\n• Refonte complète de la plateforme e-commerce.\n\n2022 - 2024 : Développeur Web | WebAgency\n• Développement d'interfaces utilisateurs dynamiques en HTML/CSS/JS.";
    const education = data.education.trim() || "2022 : Master en Informatique - Université de Paris\n2020 : Licence Informatique - Tech Academy";

    if (template === '1') {
      return (
        <div className="tmpl-1 h-full grid grid-cols-[1fr_2fr] gap-8">
          <div className="bg-[#1e3a8a] text-[#ffffff] p-6 rounded-sm">
            <h1 className="text-3xl font-bold mb-2">{name}</h1>
            <p className="text-lg opacity-90 mb-8">{title}</p>
            <div className="text-xs space-y-2 opacity-80">{contact}</div>
          </div>
          <div className="p-2">
            <h2 className="text-lg font-bold uppercase border-b-2 border-[#1e3a8a] text-[#1e3a8a] mb-4 pb-1">Profil</h2>
            <div className="whitespace-pre-line mb-6 text-sm leading-relaxed">{profile}</div>
            <h2 className="text-lg font-bold uppercase border-b-2 border-[#1e3a8a] text-[#1e3a8a] mb-4 pb-1">Expériences</h2>
            <div className="whitespace-pre-line mb-6 text-sm leading-relaxed">{experience}</div>
            <h2 className="text-lg font-bold uppercase border-b-2 border-[#1e3a8a] text-[#1e3a8a] mb-4 pb-1">Formation</h2>
            <div className="whitespace-pre-line text-sm leading-relaxed">{education}</div>
          </div>
        </div>
      );
    }

    if (template === '2') {
      return (
        <div className="tmpl-2 font-serif text-[#0f172a]">
          <div className="text-center border-b border-black pb-8 mb-8">
            <h1 className="text-4xl font-normal mb-2 uppercase tracking-wide">{name}</h1>
            <p className="text-xl italic opacity-80">{title}</p>
            <p className="text-sm mt-4 tracking-tighter opacity-70">{contact}</p>
          </div>
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-normal border-b border-dashed border-[#000000] mb-4 uppercase">Profil</h2>
              <div className="whitespace-pre-line text-sm leading-relaxed italic">{profile}</div>
            </section>
            <section>
              <h2 className="text-xl font-normal border-b border-dashed border-[#000000] mb-4 uppercase">Expériences</h2>
              <div className="whitespace-pre-line text-sm leading-relaxed">{experience}</div>
            </section>
            <section>
              <h2 className="text-xl font-normal border-b border-dashed border-[#000000] mb-4 uppercase">Formation</h2>
              <div className="whitespace-pre-line text-sm leading-relaxed">{education}</div>
            </section>
          </div>
        </div>
      );
    }

    if (template === '3') {
      return (
        <div className="tmpl-3">
          <div className="bg-[#f5f3ff] p-8 border-l-[6px] border-[#7c3aed] mb-8">
            <h1 className="text-4xl font-black text-[#7c3aed] mb-2">{name}</h1>
            <p className="text-xl font-bold opacity-80">{title}</p>
            <p className="text-sm mt-4 text-[#7c3aed]/70">{contact}</p>
          </div>
          <div className="space-y-8">
            <section>
              <h2 className="inline-block text-[#7c3aed] bg-[#f5f3ff] px-3 py-1 font-bold uppercase mb-4">Profil</h2>
              <div className="whitespace-pre-line text-sm leading-relaxed text-[#334155]">{profile}</div>
            </section>
            <section>
              <h2 className="inline-block text-[#7c3aed] bg-[#f5f3ff] px-3 py-1 font-bold uppercase mb-4">Expériences</h2>
              <div className="whitespace-pre-line text-sm leading-relaxed text-[#334155]">{experience}</div>
            </section>
            <section>
              <h2 className="inline-block text-[#7c3aed] bg-[#f5f3ff] px-3 py-1 font-bold uppercase mb-4">Formation</h2>
              <div className="whitespace-pre-line text-sm leading-relaxed text-[#334155]">{education}</div>
            </section>
          </div>
        </div>
      );
    }

    if (template === '4') {
      return (
        <div className="tmpl-4 space-y-6">
          <div className="border-b-[3px] border-double border-[#800020] pb-4">
            <h1 className="text-4xl font-bold text-[#800020]">{name}</h1>
            <p className="text-xl italic text-[#800020] opacity-80 mt-1">{title}</p>
          </div>
          <div className="grid grid-cols-[2fr_1fr] gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#800020] border-b border-[#800020] mb-3 uppercase">Expériences Professionnelles</h2>
                <div className="whitespace-pre-line text-sm leading-relaxed">{experience}</div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#800020] border-b border-[#800020] mb-3 uppercase">Cursus Scolaire</h2>
                <div className="whitespace-pre-line text-sm leading-relaxed">{education}</div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#800020] border-b border-[#800020] mb-3 uppercase">Profil</h2>
                <div className="whitespace-pre-line text-sm leading-relaxed">{profile}</div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#800020] border-b border-[#800020] mb-3 uppercase">Contact</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed opacity-80">{contact}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (template === '5') {
      return (
        <div className="tmpl-5 -m-[20mm] bg-[#fafafa]">
          <div className="bg-[#334155] text-[#fbbf24] p-12 text-center">
            <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">{name}</h1>
            <p className="text-xl font-medium tracking-tight opacity-90">{title}</p>
            <div className="mt-6 text-xs font-bold tracking-widest border-t border-[#fbbf24]/30 pt-6 flex justify-center gap-6 opacity-70 italic">
              {contact.split('|').map((c, i) => <span key={i}>{c.trim()}</span>)}
            </div>
          </div>
          <div className="p-[20mm] space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-[#334155] border-b-2 border-[#fbbf24] mb-4 pb-1">Profil</h2>
              <div className="whitespace-pre-line text-sm leading-relaxed text-[#475569]">{profile}</div>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-[#334155] border-b-2 border-[#fbbf24] mb-4 pb-1">Expériences</h2>
              <div className="whitespace-pre-line text-sm leading-relaxed text-[#475569]">{experience}</div>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-[#334155] border-b-2 border-[#fbbf24] mb-4 pb-1">Formation</h2>
              <div className="whitespace-pre-line text-sm leading-relaxed text-[#475569]">{education}</div>
            </section>
          </div>
        </div>
      );
    }

    if (template === '9') {
      return (
        <div className="tmpl-9 space-y-8">
          <div className="bg-[#f8fafc] p-6 text-center border border-[#e2e8f0] rounded-lg">
            <h1 className="text-3xl font-bold">{name}</h1>
            <p className="text-[#64748b] font-bold mt-1">{title}</p>
            <p className="text-xs text-[#94a3b8] mt-2">{contact}</p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-8">
              <div>
                <h2 className="bg-[#e2e8f0] p-1 text-center font-bold mb-4 uppercase text-sm">Résumé</h2>
                <div className="whitespace-pre-line text-sm leading-relaxed">{profile}</div>
              </div>
              <div>
                <h2 className="bg-[#e2e8f0] p-1 text-center font-bold mb-4 uppercase text-sm">Formations</h2>
                <div className="whitespace-pre-line text-sm leading-relaxed">{education}</div>
              </div>
            </div>
            <div>
              <h2 className="bg-[#e2e8f0] p-1 text-center font-bold mb-4 uppercase text-sm">Parcours Pro</h2>
              <div className="whitespace-pre-line text-sm leading-relaxed">{experience}</div>
            </div>
          </div>
        </div>
      );
    }

    if (template === '6') {
      return (
        <div className="tmpl-6 -m-[20mm] h-[297mm] flex flex-col">
          <div className="bg-[#0f172a] text-white p-12">
            <h1 className="text-4xl font-bold mb-2">{name}</h1>
            <p className="text-xl text-blue-400 font-mono">{title}</p>
          </div>
          <div className="flex-1 p-12 grid grid-cols-[1fr_2fr] gap-12 bg-white">
            <div className="space-y-8">
              <section>
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Contact</h2>
                <div className="text-sm leading-relaxed text-slate-600 font-mono whitespace-pre-line">{contact.replace(/\|/g, '\n')}</div>
              </section>
              <section>
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Compétences</h2>
                <div className="text-sm leading-relaxed text-slate-600">Adaptabilité, Rigueur, Travail d'équipe</div>
              </section>
            </div>
            <div className="space-y-10">
              <section>
                <h2 className="text-lg font-bold text-[#0f172a] border-b-2 border-[#0f172a] pb-1 mb-4">Profil</h2>
                <div className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{profile}</div>
              </section>
              <section>
                <h2 className="text-lg font-bold text-[#0f172a] border-b-2 border-[#0f172a] pb-1 mb-4">Expériences</h2>
                <div className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{experience}</div>
              </section>
              <section>
                <h2 className="text-lg font-bold text-[#0f172a] border-b-2 border-[#0f172a] pb-1 mb-4">Formation</h2>
                <div className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{education}</div>
              </section>
            </div>
          </div>
        </div>
      );
    }

    if (template === '7') {
      return (
        <div className="tmpl-7 font-sans text-slate-800">
          <div className="flex items-center gap-8 mb-12">
            <div className="w-24 h-24 bg-[#059669] rounded-2xl flex items-center justify-center text-white text-4xl font-bold">
              {name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{name}</h1>
              <p className="text-xl font-medium text-[#059669]">{title}</p>
              <p className="text-sm text-slate-500 mt-1">{contact}</p>
            </div>
          </div>
          <div className="space-y-10">
            <section className="relative pl-6 border-l-4 border-[#059669]/20">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#059669] mb-3">À propos</h2>
              <div className="whitespace-pre-line text-base leading-relaxed">{profile}</div>
            </section>
            <section className="relative pl-6 border-l-4 border-[#059669]/20">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#059669] mb-3">Expériences</h2>
              <div className="whitespace-pre-line text-base leading-relaxed">{experience}</div>
            </section>
            <section className="relative pl-6 border-l-4 border-[#059669]/20">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#059669] mb-3">Formation</h2>
              <div className="whitespace-pre-line text-base leading-relaxed">{education}</div>
            </section>
          </div>
        </div>
      );
    }

    if (template === '8') {
      return (
        <div className="tmpl-8 -m-[20mm] p-[20mm] min-h-[297mm] bg-[#1e293b] text-[#f8fafc]">
          <div className="border-l-8 border-[#38bdf8] pl-8 mb-16">
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">{name}</h1>
            <p className="text-2xl font-light text-[#38bdf8]">{title}</p>
            <div className="mt-4 text-sm opacity-60 font-mono">{contact}</div>
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-16">
            <div className="space-y-12">
              <section>
                <h2 className="text-[#38bdf8] text-xs font-bold uppercase tracking-[0.3em] mb-6">Expertise</h2>
                <div className="space-y-3 text-sm opacity-80">
                  <div className="flex justify-between"><span>UI/UX</span><span>90%</span></div>
                  <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden"><div className="bg-[#38bdf8] h-full w-[90%]"></div></div>
                  <div className="flex justify-between"><span>React</span><span>95%</span></div>
                  <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden"><div className="bg-[#38bdf8] h-full w-[95%]"></div></div>
                </div>
              </section>
              <section>
                <h2 className="text-[#38bdf8] text-xs font-bold uppercase tracking-[0.3em] mb-6">Formation</h2>
                <div className="whitespace-pre-line text-xs leading-loose opacity-70">{education}</div>
              </section>
            </div>
            <div className="space-y-12">
              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-[#38bdf8]"></span>
                  Profil
                </h2>
                <div className="whitespace-pre-line text-sm leading-relaxed opacity-80">{profile}</div>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-[#38bdf8]"></span>
                  Expériences
                </h2>
                <div className="whitespace-pre-line text-sm leading-relaxed opacity-80">{experience}</div>
              </section>
            </div>
          </div>
        </div>
      );
    }

    if (template === '10') {
      return (
        <div className="tmpl-10 font-serif text-[#1e293b]">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="w-16 h-1 bg-[#ef4444] mb-8"></div>
            <h1 className="text-4xl font-bold uppercase tracking-[0.2em] mb-2">{name}</h1>
            <p className="text-lg italic text-slate-500 mb-6">{title}</p>
            <div className="text-xs tracking-[0.1em] text-slate-400 border-y border-slate-100 py-3 w-full max-w-md">
              {contact}
            </div>
          </div>
          <div className="max-w-2xl mx-auto space-y-12">
            <section>
              <h2 className="text-center text-sm font-bold uppercase tracking-widest text-[#ef4444] mb-6">Résumé Professionnel</h2>
              <div className="whitespace-pre-line text-sm leading-relaxed text-center italic">{profile}</div>
            </section>
            <section>
              <h2 className="text-center text-sm font-bold uppercase tracking-widest text-[#ef4444] mb-6">Parcours</h2>
              <div className="whitespace-pre-line text-sm leading-relaxed">{experience}</div>
            </section>
            <section>
              <h2 className="text-center text-sm font-bold uppercase tracking-widest text-[#ef4444] mb-6">Éducation</h2>
              <div className="whitespace-pre-line text-sm leading-relaxed">{education}</div>
            </section>
          </div>
        </div>
      );
    }
    // Fallback Template
    return (
      <div className="tmpl-fallback p-8 font-sans">
        <h1 className="text-3xl font-bold mb-2">{name}</h1>
        <p className="text-xl text-slate-600 mb-8">{title}</p>
        <div className="space-y-6">
          <section>
            <h2 className="font-bold border-b pb-1 mb-2">Profil</h2>
            <div className="whitespace-pre-line text-sm">{profile}</div>
          </section>
          <section>
            <h2 className="font-bold border-b pb-1 mb-2">Expériences</h2>
            <div className="whitespace-pre-line text-sm">{experience}</div>
          </section>
          <section>
            <h2 className="font-bold border-b pb-1 mb-2">Formation</h2>
            <div className="whitespace-pre-line text-sm">{education}</div>
          </section>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-slate-50 dark:bg-[#0d1117] transition-colors rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex p-2 bg-white dark:bg-[#0d1117] border-b border-slate-200 dark:border-white/5">
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all ${
            activeTab === 'edit'
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          ✏️ Saisie des données
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all ${
            activeTab === 'preview'
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          👁️ Aperçu du CV
        </button>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Editor Side */}
        <div className={`w-full lg:w-2/5 p-6 sm:p-8 bg-white dark:bg-[#0d1117] border-r border-slate-200 dark:border-white/5 overflow-y-auto custom-scrollbar ${activeTab === 'edit' ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Layout className="text-blue-500" />
              Éditeur de CV
            </h2>
            <button 
              onClick={handleDownload}
              className="flex lg:hidden items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-sm transition-all active:scale-95"
            >
              <Download size={16} />
              PDF
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-blue-500 mb-3">Choisir un Design</label>
              <select 
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:border-blue-500/50 transition-all font-medium"
              >
                {templates.map(t => (
                  <option key={t.id} value={t.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t.name}</option>
                ))}
              </select>
            </div>

            {/* Quick Actions Panel to Load Example or Reset */}
            <div className="flex gap-2 p-1.5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setData({
                  name: '',
                  title: '',
                  contact: '',
                  profile: '',
                  experience: '',
                  education: '',
                })}
                className="flex-1 py-2.5 px-3 text-xs font-bold bg-white dark:bg-slate-900 border border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <Trash2 size={13} />
                Vider tout (À neuf)
              </button>
              <button
                onClick={() => setData({
                  name: 'Jean Dupont',
                  title: 'Développeur Web Full Stack',
                  contact: '+33 6 12 34 56 78 | jean.dupont@email.com | Paris, France',
                  profile: "Développeur passionné avec 4 ans d'expérience dans la création d'applications web modernes et performantes.",
                  experience: "2024 - Présent : Développeur Senior | Tech Solutions\n• Gestion d'une équipe de 3 développeurs.\n• Refonte complète de la plateforme e-commerce.\n\n2022 - 2024 : Développeur Web | WebAgency\n• Développement d'interfaces utilisateurs dynamiques en HTML/CSS/JS.",
                  education: "2022 : Master en Informatique - Université de Paris\n2020 : Licence Informatique - Tech Academy",
                })}
                className="flex-1 py-2.5 px-3 text-xs font-bold bg-white dark:bg-slate-900 border border-blue-500/20 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <Sparkles size={13} />
                Charger l'exemple
              </button>
            </div>

            <hr className="border-slate-200 dark:border-white/5" />

            <div className="space-y-4">
              <div className="group">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors group-focus-within:text-blue-500">
                  <User size={14} /> Nom & Prénom
                </label>
                <input 
                  type="text" 
                  value={data.name}
                  placeholder="Ex: Jean Dupont"
                  onChange={(e) => setData({...data, name: e.target.value})}
                  className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-400 dark:border-white/20 rounded-xl text-slate-950 dark:text-slate-100 outline-none focus:border-blue-600 transition-all"
                />
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors group-focus-within:text-blue-500">
                  <FileText size={14} /> Poste / Titre du CV
                </label>
                <input 
                  type="text" 
                  value={data.title}
                  placeholder="Ex: Développeur Web Full Stack"
                  onChange={(e) => setData({...data, title: e.target.value})}
                  className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-400 dark:border-white/20 rounded-xl text-slate-950 dark:text-slate-100 outline-none focus:border-blue-600 transition-all"
                />
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors group-focus-within:text-blue-500">
                  <Mail size={14} /> Contacts
                </label>
                <input 
                  type="text" 
                  value={data.contact}
                  placeholder="Ex: +33 6 12 34 56 78 | jean.dupont@email.com | Paris, France"
                  onChange={(e) => setData({...data, contact: e.target.value})}
                  className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-400 dark:border-white/20 rounded-xl text-slate-950 dark:text-slate-100 outline-none focus:border-blue-600 transition-all"
                />
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors group-focus-within:text-blue-500">
                  <User size={14} /> À propos
                </label>
                <textarea 
                  rows={3}
                  value={data.profile}
                  placeholder="Ex: Développeur passionné avec 4 ans d'expérience dans la création d'applications web..."
                  onChange={(e) => setData({...data, profile: e.target.value})}
                  className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-400 dark:border-white/20 rounded-xl text-slate-950 dark:text-slate-100 outline-none focus:border-blue-600 transition-all resize-none overflow-hidden min-h-[80px]"
                />
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors group-focus-within:text-blue-500">
                  <Briefcase size={14} /> Expériences
                </label>
                <textarea 
                  rows={6}
                  value={data.experience}
                  placeholder="Ex: 2024 - Présent : Développeur Senior | Tech Solutions&#10;• Gestion d'une équipe de 3 développeurs..."
                  onChange={(e) => setData({...data, experience: e.target.value})}
                  className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-400 dark:border-white/20 rounded-xl text-slate-950 dark:text-slate-100 outline-none focus:border-blue-600 transition-all resize-none overflow-hidden min-h-[120px] text-sm"
                />
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors group-focus-within:text-blue-500">
                  <GraduationCap size={14} /> Formations
                </label>
                <textarea 
                  rows={4}
                  value={data.education}
                  placeholder="Ex: 2022 : Master en Informatique - Université de Paris&#10;2020 : Licence Informatique..."
                  onChange={(e) => setData({...data, education: e.target.value})}
                  className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-400 dark:border-white/20 rounded-xl text-slate-950 dark:text-slate-100 outline-none focus:border-blue-600 transition-all resize-none overflow-hidden min-h-[100px] text-sm"
                />
              </div>
            </div>

            <hr className="border-slate-200 dark:border-white/5" />

            {/* Pro Tips */}
            <div className="bg-blue-500/5 rounded-2xl p-6 border border-blue-500/10">
              <h3 className="text-sm font-bold text-blue-500 mb-4 flex items-center gap-2">
                <FileText size={16} />
                Conseils Pro
              </h3>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  Soyez concis : Un bon CV doit tenir sur une seule page.
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  Verbes d'action : Utilisez "Gérer", "Créer", "Optimiser".
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  Design : Choisissez un modèle adapté à votre secteur.
                </li>
              </ul>
            </div>

            <AdSensePlaceholder type="vertical" />
          </div>
        </div>

        {/* Preview Side */}
        <div 
          ref={previewContainerRef}
          className={`flex-1 p-10 bg-slate-800 dark:bg-[#0a0c10] flex-col items-center justify-start overflow-y-auto overflow-x-hidden custom-scrollbar relative ${activeTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}
        >
          {/* Zoom & Download Toolbar */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20 gap-4">
            <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md border border-white/10 p-1.5 rounded-xl text-white shadow-xl">
              <button 
                onClick={() => {
                  setIsAutoZoom(false);
                  setManualZoom(prev => Math.max(0.3, prev - 0.1));
                }}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white"
                title="Zoom arrière"
              >
                <ZoomOut size={16} />
              </button>
              
              <button
                onClick={() => setIsAutoZoom(true)}
                className={`text-[10px] px-2 py-1 rounded-lg font-bold transition-all ${
                  isAutoZoom 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="Ajuster automatiquement à la largeur de l'écran"
              >
                Auto ({Math.round(zoom * 100)}%)
              </button>

              <button 
                onClick={() => {
                  setIsAutoZoom(false);
                  setManualZoom(prev => Math.min(1.5, prev + 0.1));
                }}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white"
                title="Zoom avant"
              >
                <ZoomIn size={16} />
              </button>
              <div className="w-px h-4 bg-white/20 mx-1"></div>
              <button 
                onClick={() => {
                  setIsAutoZoom(false);
                  setManualZoom(0.75);
                }}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Zoom par défaut"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            <button 
              onClick={handleDownload}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95 text-xs sm:text-sm"
            >
              <Download size={18} />
              Télécharger PDF
            </button>
          </div>

          <div 
            className="my-24 w-full flex justify-center items-start overflow-visible"
            style={{ height: `${1123 * zoom}px` }}
          >
            <div 
              style={{ 
                transform: `scale(${zoom})`, 
                transformOrigin: 'top center',
                width: '794px',
                height: '1123px',
              }}
              className="flex-shrink-0"
            >
              <div 
                ref={cvRef}
                className="cv-sheet w-[794px] h-[1123px] bg-[#ffffff] text-[#0f172a] p-[20mm] relative shadow-2xl"
              >
                {renderCV()}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Preview Overlay */}
        <AnimatePresence>
          {showMobilePreview && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-[100] bg-[#0a0c10] flex flex-col"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0d1117]">
                <h3 className="font-bold text-white">Aperçu du CV</h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleDownload}
                    className="p-2 bg-blue-500 text-white rounded-lg"
                  >
                    <Download size={18} />
                  </button>
                  <button 
                    onClick={() => setShowMobilePreview(false)}
                    className="p-2 bg-white/10 text-white rounded-lg"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div 
                ref={mobileContainerRef}
                className="flex-1 overflow-auto p-4 flex justify-center items-start bg-slate-900"
              >
                <div 
                  style={{
                    width: '100%',
                    height: `${1123 * mobileZoom}px`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    overflow: 'visible'
                  }}
                >
                  <div 
                    style={{
                      transform: `scale(${mobileZoom})`,
                      transformOrigin: 'top center',
                      width: '794px',
                      height: '1123px',
                    }}
                    className="flex-shrink-0"
                  >
                    <div className="w-[794px] h-[1123px] bg-[#ffffff] text-[#0f172a] p-[20mm] shadow-2xl">
                      {renderCV()}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Preview Trigger (Floating Button) */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          <button 
            onClick={() => {
              setActiveTab('preview');
              setShowMobilePreview(true);
            }}
            className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
          >
            <Layout size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
