import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, Layout, User, Briefcase, GraduationCap, Mail, X, Trash2, Sparkles, ZoomIn, ZoomOut, RotateCcw, Globe, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// @ts-ignore - html2pdf.js doesn't have official types
import html2pdf from 'html2pdf.js';

interface CVData {
  name: string;
  title: string;
  contact: string;
  profile: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  photo?: string;
  countryFormat: string;
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
    skills: '',
    languages: '',
    photo: '',
    countryFormat: 'fr',
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

  // Auto-resize textareas based on content
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

  const countries = [
    {
      id: 'fr',
      name: 'France / Belgique / Suisse',
      flag: '🇫🇷',
      photoAllowed: true,
      advice: 'Format classique européen francophone. La photo est recommandée. Le CV doit idéalement tenir sur une seule page A4 et être structuré.',
      labels: {
        profile: 'Profil Professionnel',
        experience: 'Expériences Professionnelles',
        education: 'Formation & Diplômes',
        skills: 'Compétences',
        languages: 'Langues',
        contact: 'Contact'
      },
      defaultData: {
        name: 'Jean Dupont',
        title: 'Développeur Web Full Stack',
        contact: '+33 6 12 34 56 78 | jean.dupont@email.com | Paris, France',
        profile: "Développeur passionné avec 4 ans d'expérience dans la création d'applications web modernes et performantes. Spécialisé en React et Node.js avec une sensibilité pour l'UX.",
        experience: "2024 - Présent : Développeur Senior | Tech Solutions\n• Gestion d'une équipe de 3 développeurs.\n• Refonte complète de la plateforme en Next.js (gain de 40% de performance).\n\n2022 - 2024 : Développeur Web | WebAgency\n• Développement de plus de 15 sites web dynamiques.\n• Intégration d'API de paiement sécurisé.",
        education: "2022 : Master en Informatique - Université de Paris\n2020 : Licence Informatique - Tech Academy",
        skills: 'React, TypeScript, Node.js, Next.js, Tailwind CSS, PostgreSQL, Docker, Git',
        languages: 'Français (Natif), Anglais (B2 - Technique)'
      }
    },
    {
      id: 'us',
      name: 'États-Unis / Canada (ATS)',
      flag: '🇺🇸',
      photoAllowed: false,
      advice: '⚠️ RÈGLE SANS PHOTO ! Ne mettez jamais de photo, d\'âge ou de genre pour éviter toute discrimination. Utilisez des polices sobres et des réalisations mesurables.',
      labels: {
        profile: 'Professional Summary',
        experience: 'Professional Experience',
        education: 'Education',
        skills: 'Core Competencies',
        languages: 'Languages',
        contact: 'Contact Information'
      },
      defaultData: {
        name: 'John Miller',
        title: 'Senior Software Engineer',
        contact: '+1 (555) 019-2834 | john.miller@email.com | New York, NY',
        profile: "Results-driven Software Engineer with over 5 years of experience in designing, building, and deploying scalable web applications. Expert in React and Node.js with a proven track record of driving system efficiency.",
        experience: "2024 - Present: Lead Developer | CloudNexus Inc.\n• Led development of a microservices application serving 100k+ active daily users.\n• Optimized database queries, reducing response times by 35%.\n\n2021 - 2024: Software Engineer | DevFlow Corp.\n• Developed and shipped 8+ core features using React and AWS.\n• Reduced frontend bundle sizes by 45% through lazy loading.",
        education: "2021: M.S. in Computer Science - Columbia University\n2019: B.S. in Software Engineering - NYU",
        skills: 'JavaScript, TypeScript, React, Node.js, AWS, PostgreSQL, GraphQL, Docker, Git',
        languages: 'English (Native), French (Conversational)'
      }
    },
    {
      id: 'europass',
      name: 'Europass (Europe Standard)',
      flag: '🇪🇺',
      photoAllowed: true,
      advice: 'Le format officiel standardisé par la Commission Européenne. Hautement structuré, idéal pour postuler dans les universités, ONG ou administrations publiques.',
      labels: {
        profile: 'Profil',
        experience: 'Expérience Professionnelle',
        education: 'Éducation et Formation',
        skills: 'Compétences clés',
        languages: 'Langues Étrangères',
        contact: 'Coordonnées de Contact'
      },
      defaultData: {
        name: 'Marie Leroy',
        title: 'Chef de Projet Européen / Consultante',
        contact: '+32 2 543 21 00 | marie.leroy@email.com | Bruxelles, Belgique',
        profile: "Professionnelle de la gestion de projet avec une expertise solide dans le montage de dossiers de financement européens (Horizon Europe, Erasmus+). Forte capacité de négociation et de coordination interculturelle.",
        experience: "2023 - Présent : Chef de Projet Européen | EuroConsulting\n• Coordination d'un consortium de 12 partenaires dans 6 pays.\n• Gestion d'un budget global de 2.4 millions d'euros.\n\n2021 - 2023 : Chargée de Mission Europe | Région Francophone\n• Accompagnement des PME locales dans leurs réponses aux appels d'offres européens.",
        education: "2021 : Master en Affaires Européennes - Collège d'Europe\n2019 : Master en Sciences Politiques - Sciences Po Lyon",
        skills: 'Gestion de projet, Financements européens, Négociation internationale, Rapports budgétaires',
        languages: 'Français (Natif), Anglais (C1 - Courant), Allemand (B1 - Intermédiaire)'
      }
    },
    {
      id: 'uk',
      name: 'Royaume-Uni (UK CV)',
      flag: '🇬🇧',
      photoAllowed: false,
      advice: '⚠️ Pas de photo ! Les recruteurs britanniques rejettent les CV avec photo pour éviter les biais. Débutez par un "Personal Statement" percutant et des verbes d\'action.',
      labels: {
        profile: 'Personal Statement',
        experience: 'Employment History',
        education: 'Education & Qualifications',
        skills: 'Core Competencies',
        languages: 'Languages',
        contact: 'Contact Info'
      },
      defaultData: {
        name: 'Sarah Jenkins',
        title: 'Senior Digital Marketing Manager',
        contact: '+44 7700 900077 | sarah.jenkins@email.co.uk | London, UK',
        profile: "Dynamic and innovative Digital Marketing Specialist with 6+ years of experience delivering high-impact online campaigns. Proven expertise in SEO, paid media, and brand strategy with a history of increasing organic traffic by up to 150%.",
        experience: "2023 - Present: Digital Marketing Manager | Horizon Retail Group\n• Spearheaded digital strategy resulting in a £1.2M increase in online sales within 12 months.\n• Managed an annual digital advertising budget of £250k with a 4.2x ROI.\n\n2020 - 2023: Senior SEO Analyst | Apex Agency\n• Managed SEO strategies for 20+ blue-chip clients, improving rankings by 42%.",
        education: "2020: MSc in Strategic Marketing - Imperial College London\n2018: BA in Business & Marketing - University of Leeds",
        skills: 'SEO/SEM, GA4, Hubspot, Paid Search (PPC), Content Strategy, Team Leadership',
        languages: 'English (Native), Spanish (Professional)'
      }
    },
    {
      id: 'au',
      name: 'Australie & Nouvelle-Zélande',
      flag: '🇦🇺',
      photoAllowed: false,
      advice: 'Pas de photo. Les CV australiens peuvent être un peu plus détaillés et se concentrent sur vos réalisations mesurables avec des objectifs de carrière bien définis.',
      labels: {
        profile: 'Career Objective & Summary',
        experience: 'Employment History',
        education: 'Education & Training',
        skills: 'Key Expertise',
        languages: 'Languages',
        contact: 'Contact Details'
      },
      defaultData: {
        name: 'David Vance',
        title: 'Senior IT Project Manager',
        contact: '+61 2 9876 5432 | david.vance@email.com.au | Sydney, NSW',
        profile: "PMP-certified IT Project Manager with 8+ years of experience steering enterprise-level infrastructure and cloud migration initiatives. Adept at driving agile teams to deliver projects on-time.",
        experience: "2023 - Present: Senior IT Project Lead | Southern Cross Solutions\n• Delivered a legacy-to-AWS cloud migration project ($3M value) 2 weeks ahead of schedule.\n• Implemented Agile Scrum practices, increasing delivery predictability by 20%.\n\n2019 - 2023: IT Project Manager | Oceania Tech\n• Managed a portfolio of 15 security and hardware deployment projects.",
        education: "2019: Project Management Professional (PMP) - PMI\n2018: Bachelor of Information Technology - UNSW",
        skills: 'Agile & Scrum, AWS Migration, Risk Management, Stakeholder Management, Budgets',
        languages: 'English (Native)'
      }
    },
    {
      id: 'asia',
      name: 'Moyen-Orient / Asie',
      flag: '🇦🇪',
      photoAllowed: true,
      advice: 'Une photo professionnelle de haute qualité est attendue au Moyen-Orient et dans plusieurs pays d\'Asie. Le CV est très formel et complet.',
      labels: {
        profile: 'Executive Summary',
        experience: 'Professional History',
        education: 'Academic Background',
        skills: 'Key Capabilities',
        languages: 'Languages spoken',
        contact: 'Personal & Contact Info'
      },
      defaultData: {
        name: 'Alexander Wong',
        title: 'International Business Development Director',
        contact: '+971 4 123 4567 | alex.wong@email.ae | Dubai, UAE',
        profile: "Dynamic Business Leader with over 10 years of cross-functional experience in Singapore, Hong Kong, and the GCC. Specialized in expanding market footprints, structuring joint ventures, and leading sales teams.",
        experience: "2024 - Present: Business Development Director | Gulf Enterprise Group\n• Expanded market share in UAE and Saudi Arabia by 18% through strategic alliances.\n• Closed high-ticket deals valued at over $15M in regional B2B contracts.\n\n2020 - 2024: Regional Sales Manager | AsiaTech Systems (Singapore)\n• Directed a team of 12 sales executives across ASEAN regions, achieving 115% quota consistency.",
        education: "2020: Executive MBA - INSEAD\n2015: Bachelor of Business Administration - NUS",
        skills: 'Market Expansion, Strategic Partnerships, GCC Regulations, B2B Sales, Executive Leadership',
        languages: 'English (Fluent), Mandarin Chinese (Native), Arabic (Conversational)'
      }
    }
  ];

  const activeCountry = countries.find(c => c.id === data.countryFormat) || countries[0];
  const labels = activeCountry.labels;

  const name = data.name.trim() || activeCountry.defaultData.name;
  const title = data.title.trim() || activeCountry.defaultData.title;
  const contact = data.contact.trim() || activeCountry.defaultData.contact;
  const profile = data.profile.trim() || activeCountry.defaultData.profile;
  const experience = data.experience.trim() || activeCountry.defaultData.experience;
  const education = data.education.trim() || activeCountry.defaultData.education;
  const skills = data.skills.trim() || activeCountry.defaultData.skills;
  const languages = data.languages.trim() || activeCountry.defaultData.languages;

  const renderPhoto = (className = "w-24 h-24 rounded-full object-cover border border-slate-200") => {
    if (activeCountry.photoAllowed && data.photo) {
      return (
        <div className="flex-shrink-0">
          <img src={data.photo} alt={name} className={className} referrerPolicy="no-referrer" />
        </div>
      );
    }
    return null;
  };

  const renderSkillsList = (color = "#3b82f6") => {
    if (!skills) return null;
    return (
      <div className="flex flex-wrap gap-1 mt-1.5">
        {skills.split(',').map((s, i) => (
          <span 
            key={i} 
            className="text-[10px] px-2 py-0.5 font-semibold rounded-md border"
            style={{
              borderColor: `${color}25`,
              backgroundColor: `${color}08`,
              color: color
            }}
          >
            {s.trim()}
          </span>
        ))}
      </div>
    );
  };

  const renderLanguagesList = () => {
    if (!languages) return null;
    return (
      <div className="space-y-1 mt-1.5">
        {languages.split(',').map((l, i) => (
          <div key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-slate-400"></span>
            <span>{l.trim()}</span>
          </div>
        ))}
      </div>
    );
  };

  const templates = [
    { id: '1', name: 'Moderne Corporate (Bleu)' },
    { id: '2', name: 'Minimaliste Chic (Lettres)' },
    { id: '3', name: 'Créatif Épuré (Violet)' },
    { id: '4', name: 'Élégance (Bordeaux)' },
    { id: '5', name: 'Exécutif (Gris & Or)' },
    { id: '6', name: 'Compact Tech (Noir)' },
    { id: '7', name: 'Esprit Startup (Vert)' },
    { id: '8', name: 'Modèle Sombre (Dark)' },
    { id: '9', name: 'Double Colonne Symétrique' },
    { id: '10', name: 'Classique Épuré (Rouge)' },
  ];

  const renderCV = () => {
    if (template === '1') {
      return (
        <div className="tmpl-1 h-full grid grid-cols-[1.1fr_2fr] gap-6 text-[#0f172a]">
          <div className="bg-[#1e3a8a] text-white p-5 rounded-md flex flex-col justify-between">
            <div>
              {renderPhoto("w-28 h-28 rounded-xl object-cover border-2 border-white/20 mb-4 shadow-sm")}
              <h1 className="text-xl font-bold mb-1 leading-tight">{name}</h1>
              <p className="text-xs opacity-90 mb-5 font-semibold text-blue-200">{title}</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-blue-300 border-b border-white/10 pb-0.5 mb-1.5">{labels.contact}</h3>
                  <div className="text-[10px] space-y-1 opacity-80 whitespace-pre-line leading-relaxed">{contact.replace(/\|/g, '\n')}</div>
                </div>

                {skills && (
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-blue-300 border-b border-white/10 pb-0.5 mb-1.5">{labels.skills}</h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.split(',').map((s, i) => (
                        <span key={i} className="text-[9px] px-1.5 py-0.5 bg-white/10 rounded font-medium">{s.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}

                {languages && (
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-blue-300 border-b border-white/10 pb-0.5 mb-1.5">{labels.languages}</h3>
                    <div className="text-[10px] space-y-1 opacity-80">
                      {languages.split(',').map((l, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-white/50"></span>
                          <span>{l.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="py-2 pr-2 overflow-hidden flex flex-col justify-start">
            <h2 className="text-sm font-bold uppercase border-b border-[#1e3a8a] text-[#1e3a8a] mb-2 pb-0.5">{labels.profile}</h2>
            <div className="whitespace-pre-line mb-4 text-xs leading-relaxed text-slate-700">{profile}</div>
            
            <h2 className="text-sm font-bold uppercase border-b border-[#1e3a8a] text-[#1e3a8a] mb-2 pb-0.5">{labels.experience}</h2>
            <div className="whitespace-pre-line mb-4 text-xs leading-relaxed text-slate-700 font-sans">{experience}</div>
            
            <h2 className="text-sm font-bold uppercase border-b border-[#1e3a8a] text-[#1e3a8a] mb-2 pb-0.5">{labels.education}</h2>
            <div className="whitespace-pre-line text-xs leading-relaxed text-slate-700">{education}</div>
          </div>
        </div>
      );
    }

    if (template === '2') {
      return (
        <div className="tmpl-2 font-serif text-[#0f172a] h-full flex flex-col justify-between">
          <div className="text-center border-b border-black pb-4 mb-4 flex flex-col items-center">
            {renderPhoto("w-20 h-20 rounded-full object-cover border border-slate-300 mb-2 shadow-sm")}
            <h1 className="text-2xl font-bold mb-0.5 uppercase tracking-wide">{name}</h1>
            <p className="text-base italic opacity-85">{title}</p>
            <p className="text-[10px] mt-1.5 tracking-wide opacity-70">{contact}</p>
          </div>
          <div className="grid grid-cols-[2fr_1fr] gap-6 flex-1 overflow-hidden">
            <div className="space-y-4">
              <section>
                <h2 className="text-xs font-bold border-b border-black mb-1.5 uppercase tracking-wider">{labels.profile}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed italic text-slate-800">{profile}</div>
              </section>
              <section>
                <h2 className="text-xs font-bold border-b border-black mb-1.5 uppercase tracking-wider">{labels.experience}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed text-slate-800">{experience}</div>
              </section>
            </div>
            <div className="space-y-4 border-l border-slate-200 pl-4">
              <section>
                <h2 className="text-xs font-bold border-b border-black mb-1.5 uppercase tracking-wider">{labels.education}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed text-slate-800">{education}</div>
              </section>
              {skills && (
                <section>
                  <h2 className="text-xs font-bold border-b border-black mb-1.5 uppercase tracking-wider">{labels.skills}</h2>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {skills.split(',').map((s, i) => (
                      <span key={i} className="text-[9px] border border-black/30 px-1.5 py-0.5 rounded italic">{s.trim()}</span>
                    ))}
                  </div>
                </section>
              )}
              {languages && (
                <section>
                  <h2 className="text-xs font-bold border-b border-black mb-1.5 uppercase tracking-wider">{labels.languages}</h2>
                  <div className="text-[11px] leading-relaxed text-slate-800 space-y-1">
                    {languages.split(',').map((l, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-black rounded-full"></span>
                        <span>{l.trim()}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (template === '3') {
      return (
        <div className="tmpl-3 h-full flex flex-col justify-between text-slate-800">
          <div className="bg-[#f5f3ff] p-4 border-l-[6px] border-[#7c3aed] mb-4 flex items-center justify-between gap-4 rounded-r-md">
            <div>
              <h1 className="text-xl font-black text-[#7c3aed] mb-0.5">{name}</h1>
              <p className="text-sm font-bold opacity-80 text-slate-700">{title}</p>
              <p className="text-[10px] mt-1.5 text-[#7c3aed]/80">{contact}</p>
            </div>
            {renderPhoto("w-16 h-16 rounded-xl object-cover border-2 border-[#7c3aed]/30 shadow-xs")}
          </div>
          <div className="grid grid-cols-[2fr_1fr] gap-6 flex-1 overflow-hidden">
            <div className="space-y-4">
              <section>
                <h2 className="inline-block text-[#7c3aed] bg-[#f5f3ff] px-2 py-0.5 font-bold text-[10px] uppercase rounded mb-1.5">{labels.profile}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed text-slate-700">{profile}</div>
              </section>
              <section>
                <h2 className="inline-block text-[#7c3aed] bg-[#f5f3ff] px-2 py-0.5 font-bold text-[10px] uppercase rounded mb-1.5">{labels.experience}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed text-slate-700">{experience}</div>
              </section>
            </div>
            <div className="space-y-4 border-l border-purple-100 pl-4">
              <section>
                <h2 className="inline-block text-[#7c3aed] bg-[#f5f3ff] px-2 py-0.5 font-bold text-[10px] uppercase rounded mb-1.5">{labels.education}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed text-slate-700">{education}</div>
              </section>
              {skills && (
                <section>
                  <h2 className="inline-block text-[#7c3aed] bg-[#f5f3ff] px-2 py-0.5 font-bold text-[10px] uppercase rounded mb-1.5">{labels.skills}</h2>
                  {renderSkillsList("#7c3aed")}
                </section>
              )}
              {languages && (
                <section>
                  <h2 className="inline-block text-[#7c3aed] bg-[#f5f3ff] px-2 py-0.5 font-bold text-[10px] uppercase rounded mb-1.5">{labels.languages}</h2>
                  {renderLanguagesList()}
                </section>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (template === '4') {
      return (
        <div className="tmpl-4 h-full flex flex-col justify-between text-[#2a1b1b]">
          <div className="border-b-[3px] border-double border-[#800020] pb-2 mb-3 flex justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#800020]">{name}</h1>
              <p className="text-sm italic text-[#800020]/90 mt-0.5">{title}</p>
            </div>
            {renderPhoto("w-14 h-14 rounded-full object-cover border border-[#800020]/30 shadow-xs")}
          </div>
          <div className="grid grid-cols-[2fr_1fr] gap-6 flex-1 overflow-hidden">
            <div className="space-y-4">
              <div>
                <h2 className="text-xs font-bold text-[#800020] border-b border-[#800020] mb-1.5 uppercase tracking-wide">{labels.experience}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed text-slate-800">{experience}</div>
              </div>
              <div>
                <h2 className="text-xs font-bold text-[#800020] border-b border-[#800020] mb-1.5 uppercase tracking-wide">{labels.education}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed text-slate-800">{education}</div>
              </div>
            </div>
            <div className="space-y-4 pl-2">
              <div>
                <h2 className="text-xs font-bold text-[#800020] border-b border-[#800020] mb-1.5 uppercase tracking-wide">{labels.profile}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed text-slate-800">{profile}</div>
              </div>
              {skills && (
                <div>
                  <h2 className="text-xs font-bold text-[#800020] border-b border-[#800020] mb-1.5 uppercase tracking-wide">{labels.skills}</h2>
                  {renderSkillsList("#800020")}
                </div>
              )}
              {languages && (
                <div>
                  <h2 className="text-xs font-bold text-[#800020] border-b border-[#800020] mb-1.5 uppercase tracking-wide">{labels.languages}</h2>
                  {renderLanguagesList()}
                </div>
              )}
              <div>
                <h2 className="text-xs font-bold text-[#800020] border-b border-[#800020] mb-1.5 uppercase tracking-wide">{labels.contact}</h2>
                <div className="whitespace-pre-line text-[10px] leading-relaxed text-slate-700">{contact.replace(/\|/g, '\n')}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (template === '5') {
      return (
        <div className="tmpl-5 -m-[20mm] bg-[#fafafa] h-[1123px] flex flex-col justify-between text-slate-800">
          <div className="bg-[#334155] text-[#fbbf24] p-6 text-center flex flex-col items-center justify-center">
            {renderPhoto("w-16 h-16 rounded-full object-cover border-2 border-[#fbbf24] mb-2 shadow-md")}
            <h1 className="text-xl font-bold uppercase tracking-wider mb-0.5">{name}</h1>
            <p className="text-xs font-medium tracking-normal opacity-90 text-white">{title}</p>
            <div className="mt-2 text-[9px] font-bold tracking-wide border-t border-[#fbbf24]/30 pt-2 flex justify-center flex-wrap gap-4 opacity-80">
              {contact.split('|').map((c, i) => <span key={i}>{c.trim()}</span>)}
            </div>
          </div>
          <div className="p-6 grid grid-cols-[2fr_1fr] gap-6 flex-1 overflow-hidden">
            <div className="space-y-4">
              <section>
                <h2 className="text-xs font-bold text-[#334155] border-b-2 border-[#fbbf24] mb-1.5 pb-0.5 uppercase tracking-wider">{labels.profile}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed text-[#475569]">{profile}</div>
              </section>
              <section>
                <h2 className="text-xs font-bold text-[#334155] border-b-2 border-[#fbbf24] mb-1.5 pb-0.5 uppercase tracking-wider">{labels.experience}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed text-[#475569]">{experience}</div>
              </section>
            </div>
            <div className="space-y-4 border-l border-slate-200 pl-4">
              <section>
                <h2 className="text-xs font-bold text-[#334155] border-b-2 border-[#fbbf24] mb-1.5 pb-0.5 uppercase tracking-wider">{labels.education}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed text-[#475569]">{education}</div>
              </section>
              {skills && (
                <section>
                  <h2 className="text-xs font-bold text-[#334155] border-b-2 border-[#fbbf24] mb-1.5 pb-0.5 uppercase tracking-wider">{labels.skills}</h2>
                  {renderSkillsList("#334155")}
                </section>
              )}
              {languages && (
                <section>
                  <h2 className="text-xs font-bold text-[#334155] border-b-2 border-[#fbbf24] mb-1.5 pb-0.5 uppercase tracking-wider">{labels.languages}</h2>
                  {renderLanguagesList()}
                </section>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (template === '6') {
      return (
        <div className="tmpl-6 -m-[20mm] h-[1123px] flex flex-col justify-between bg-white text-slate-800">
          <div className="bg-[#0f172a] text-white p-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold mb-0.5">{name}</h1>
              <p className="text-xs text-blue-400 font-mono font-bold">{title}</p>
            </div>
            {renderPhoto("w-14 h-14 rounded-xl object-cover border-2 border-blue-400/30")}
          </div>
          <div className="flex-1 p-6 grid grid-cols-[1fr_2fr] gap-6 overflow-hidden">
            <div className="space-y-4 border-r border-slate-100 pr-4">
              <section>
                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{labels.contact}</h2>
                <div className="text-[10px] leading-relaxed text-slate-600 font-mono whitespace-pre-line">{contact.replace(/\|/g, '\n')}</div>
              </section>
              {skills && (
                <section>
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{labels.skills}</h2>
                  {renderSkillsList("#0f172a")}
                </section>
              )}
              {languages && (
                <section>
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{labels.languages}</h2>
                  {renderLanguagesList()}
                </section>
              )}
            </div>
            <div className="space-y-4">
              <section>
                <h2 className="text-xs font-bold text-[#0f172a] border-b-2 border-[#0f172a] pb-0.5 mb-1.5">{labels.profile}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed text-slate-700">{profile}</div>
              </section>
              <section>
                <h2 className="text-xs font-bold text-[#0f172a] border-b-2 border-[#0f172a] pb-0.5 mb-1.5">{labels.experience}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed text-slate-700">{experience}</div>
              </section>
              <section>
                <h2 className="text-xs font-bold text-[#0f172a] border-b-2 border-[#0f172a] pb-0.5 mb-1.5">{labels.education}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed text-slate-700">{education}</div>
              </section>
            </div>
          </div>
        </div>
      );
    }

    if (template === '7') {
      return (
        <div className="tmpl-7 font-sans text-slate-800 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between gap-4 mb-3 border-b pb-3 border-slate-100">
            <div className="flex items-center gap-3">
              {activeCountry.photoAllowed && data.photo ? (
                renderPhoto("w-14 h-14 rounded-xl object-cover border-2 border-[#059669] shadow-xs")
              ) : (
                <div className="w-14 h-14 bg-[#059669] rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
              )}
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{name}</h1>
                <p className="text-xs font-semibold text-[#059669]">{title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{contact}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-[2fr_1fr] gap-6 flex-1 overflow-hidden">
            <div className="space-y-4">
              <section className="relative pl-3 border-l-4 border-[#059669]/20">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-[#059669] mb-1">{labels.profile}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed text-slate-700">{profile}</div>
              </section>
              <section className="relative pl-3 border-l-4 border-[#059669]/20">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-[#059669] mb-1">{labels.experience}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed text-slate-700">{experience}</div>
              </section>
            </div>
            <div className="space-y-4 pl-3 border-l border-slate-100">
              <section>
                <h2 className="text-[10px] font-black uppercase tracking-widest text-[#059669] mb-1">{labels.education}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed text-slate-700">{education}</div>
              </section>
              {skills && (
                <section>
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-[#059669] mb-1">{labels.skills}</h2>
                  {renderSkillsList("#059669")}
                </section>
              )}
              {languages && (
                <section>
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-[#059669] mb-1">{labels.languages}</h2>
                  {renderLanguagesList()}
                </section>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (template === '8') {
      return (
        <div className="tmpl-8 -m-[20mm] p-6 min-h-[1123px] bg-[#1e293b] text-[#f8fafc] flex flex-col justify-between">
          <div className="border-l-8 border-[#38bdf8] pl-5 mb-5 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight mb-0.5">{name}</h1>
              <p className="text-base font-light text-[#38bdf8]">{title}</p>
              <div className="mt-2 text-[10px] opacity-60 font-mono">{contact}</div>
            </div>
            {renderPhoto("w-14 h-14 rounded-xl object-cover border-2 border-[#38bdf8] shadow-xs")}
          </div>
          <div className="grid grid-cols-[1.1fr_2fr] gap-6 flex-1 overflow-hidden">
            <div className="space-y-4 border-r border-white/5 pr-4">
              <section>
                <h2 className="text-[#38bdf8] text-[10px] font-black uppercase tracking-wider mb-1.5">{labels.education}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed opacity-70">{education}</div>
              </section>
              {skills && (
                <section>
                  <h2 className="text-[#38bdf8] text-[10px] font-black uppercase tracking-wider mb-1.5">{labels.skills}</h2>
                  <div className="flex flex-wrap gap-1">
                    {skills.split(',').map((s, i) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 bg-white/10 text-[#38bdf8] border border-[#38bdf8]/20 rounded font-medium">{s.trim()}</span>
                    ))}
                  </div>
                </section>
              )}
              {languages && (
                <section>
                  <h2 className="text-[#38bdf8] text-[10px] font-black uppercase tracking-wider mb-1.5">{labels.languages}</h2>
                  <div className="text-xs space-y-1 opacity-70">
                    {languages.split(',').map((l, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-[#38bdf8] rounded-full"></span>
                        <span>{l.trim()}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <div className="space-y-4">
              <section>
                <h2 className="text-[#38bdf8] text-[10px] font-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span className="w-3 h-px bg-[#38bdf8]"></span>
                  {labels.profile}
                </h2>
                <div className="whitespace-pre-line text-xs leading-relaxed opacity-80">{profile}</div>
              </section>
              <section>
                <h2 className="text-[#38bdf8] text-[10px] font-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span className="w-3 h-px bg-[#38bdf8]"></span>
                  {labels.experience}
                </h2>
                <div className="whitespace-pre-line text-xs leading-relaxed opacity-80">{experience}</div>
              </section>
            </div>
          </div>
        </div>
      );
    }

    if (template === '9') {
      return (
        <div className="tmpl-9 h-full flex flex-col justify-between text-slate-800">
          <div className="bg-[#f8fafc] p-3 text-center border border-[#e2e8f0] rounded-xl flex flex-col items-center mb-3">
            {renderPhoto("w-14 h-14 rounded-full object-cover border border-slate-200 mb-1.5 shadow-xs")}
            <h1 className="text-xl font-bold text-slate-800">{name}</h1>
            <p className="text-[#64748b] font-bold text-xs mt-0.5">{title}</p>
            <p className="text-[9px] text-[#94a3b8] mt-1">{contact}</p>
          </div>
          <div className="grid grid-cols-2 gap-6 flex-1 overflow-hidden">
            <div className="space-y-4 pr-3 border-r border-slate-100">
              <div>
                <h2 className="bg-[#e2e8f0] py-0.5 text-center font-bold mb-1.5 uppercase text-[10px] rounded text-slate-600">{labels.profile}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed text-slate-600">{profile}</div>
              </div>
              <div>
                <h2 className="bg-[#e2e8f0] py-0.5 text-center font-bold mb-1.5 uppercase text-[10px] rounded text-slate-600">{labels.education}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed text-slate-600">{education}</div>
              </div>
              {languages && (
                <div>
                  <h2 className="bg-[#e2e8f0] py-0.5 text-center font-bold mb-1.5 uppercase text-[10px] rounded text-slate-600">{labels.languages}</h2>
                  {renderLanguagesList()}
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="bg-[#e2e8f0] py-0.5 text-center font-bold mb-1.5 uppercase text-[10px] rounded text-slate-600">{labels.experience}</h2>
                <div className="whitespace-pre-line text-xs leading-relaxed text-slate-600">{experience}</div>
              </div>
              {skills && (
                <div>
                  <h2 className="bg-[#e2e8f0] py-0.5 text-center font-bold mb-1.5 uppercase text-[10px] rounded text-slate-600">{labels.skills}</h2>
                  {renderSkillsList("#475569")}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Default template (10)
    return (
      <div className="tmpl-10 font-serif text-[#1e293b] h-full flex flex-col justify-between">
        <div className="flex flex-col items-center text-center mb-3">
          <div className="w-10 h-0.5 bg-[#ef4444] mb-2"></div>
          {renderPhoto("w-14 h-14 rounded-full object-cover border border-slate-200 mb-1.5 shadow-xs")}
          <h1 className="text-xl font-bold uppercase tracking-wider mb-0.5">{name}</h1>
          <p className="text-xs italic text-slate-500 mb-1">{title}</p>
          <div className="text-[10px] tracking-wide text-slate-400 border-y border-slate-100 py-1 w-full max-w-md">
            {contact}
          </div>
        </div>
        <div className="grid grid-cols-[2fr_1fr] gap-6 flex-1 overflow-hidden">
          <div className="space-y-4">
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#ef4444] mb-1.5 border-b border-red-100 pb-0.5">{labels.profile}</h2>
              <div className="whitespace-pre-line text-xs leading-relaxed text-slate-600 italic">{profile}</div>
            </section>
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#ef4444] mb-1.5 border-b border-red-100 pb-0.5">{labels.experience}</h2>
              <div className="whitespace-pre-line text-xs leading-relaxed text-slate-600">{experience}</div>
            </section>
          </div>
          <div className="space-y-4 pl-4 border-l border-slate-100">
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#ef4444] mb-1.5 border-b border-red-100 pb-0.5">{labels.education}</h2>
              <div className="whitespace-pre-line text-xs leading-relaxed text-slate-600">{education}</div>
            </section>
            {skills && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#ef4444] mb-1.5 border-b border-red-100 pb-0.5">{labels.skills}</h2>
                {renderSkillsList("#ef4444")}
              </section>
            )}
            {languages && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#ef4444] mb-1.5 border-b border-red-100 pb-0.5">{labels.languages}</h2>
                {renderLanguagesList()}
              </section>
            )}
          </div>
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
              ? 'bg-blue-500 text-white shadow-lg'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          ✏️ Saisie des données
        </button>
        <button
          onClick={() => {
            setActiveTab('preview');
            setShowMobilePreview(true);
          }}
          className={`flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all ${
            activeTab === 'preview'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          👁️ Aperçu du CV
        </button>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Editor Side */}
        <div className={`w-full lg:w-2/5 p-5 bg-white dark:bg-[#0d1117] border-r border-slate-200 dark:border-white/5 overflow-y-auto custom-scrollbar ${activeTab === 'edit' ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layout className="text-blue-500" size={18} />
              Générateur de CV Multi-Pays
            </h2>
            <button 
              onClick={handleDownload}
              className="flex lg:hidden items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold text-xs transition-all active:scale-95"
            >
              <Download size={14} />
              PDF
            </button>
          </div>

          <div className="space-y-5">
            {/* Country Standard Selector */}
            <div className="bg-slate-50 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-200/60 dark:border-white/5">
              <label className="block text-xs font-black uppercase tracking-wider text-blue-500 mb-2.5 flex items-center gap-1.5">
                <Globe size={13} />
                Format par pays / Norme de recrutement
              </label>
              <select
                value={data.countryFormat}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const targetCountry = countries.find(c => c.id === selectedId);
                  if (targetCountry) {
                    setData(prev => ({
                      ...prev,
                      countryFormat: selectedId,
                      // Pre-fill with the country sample automatically
                      ...targetCountry.defaultData
                    }));
                  }
                }}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:border-blue-500/50 transition-all font-semibold text-xs sm:text-sm"
              >
                {countries.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name} {c.photoAllowed ? '(Avec photo)' : '(Sans photo - ATS)'}
                  </option>
                ))}
              </select>

              <div className="mt-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 space-y-2">
                <div className="flex items-start gap-1.5">
                  <Info size={12} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Conseil pour ce pays : </span>
                    {activeCountry.advice}
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      if (confirm(`Voulez-vous réinitialiser et recharger le modèle d'exemple officiel pour le pays ${activeCountry.name} ? Cela écrasera vos modifications actuelles.`)) {
                        setData({
                          ...activeCountry.defaultData,
                          countryFormat: activeCountry.id,
                          photo: data.photo || ''
                        });
                      }
                    }}
                    className="text-[10px] text-blue-500 hover:text-blue-600 font-bold flex items-center gap-1"
                  >
                    <Sparkles size={11} />
                    Réappliquer le modèle type {activeCountry.flag}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Style visuel du template</label>
              <select 
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:border-blue-500/50 transition-all text-xs"
              >
                {templates.map(t => (
                  <option key={t.id} value={t.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (confirm("Voulez-vous vider tous les champs ?")) {
                    setData({
                      name: '',
                      title: '',
                      contact: '',
                      profile: '',
                      experience: '',
                      education: '',
                      skills: '',
                      languages: '',
                      photo: '',
                      countryFormat: data.countryFormat,
                    });
                  }
                }}
                className="flex-1 py-2 px-3 text-xs font-bold bg-white dark:bg-slate-900 border border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Trash2 size={13} />
                Vider (A neuf)
              </button>
            </div>

            <hr className="border-slate-200 dark:border-white/5" />

            {/* Inputs Form */}
            <div className="space-y-4">
              {/* Photo Input (conditional) */}
              {activeCountry.photoAllowed ? (
                <div className="group">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    <User size={13} /> Photo de profil
                  </label>
                  <div className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                    <div className="relative w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {data.photo ? (
                        <img src={data.photo} alt="Photo" className="w-full h-full object-cover" />
                      ) : (
                        <User className="text-slate-400" size={18} />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <input 
                        type="file" 
                        accept="image/*"
                        id="photo-file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setData({ ...data, photo: ev.target?.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                      <div className="flex gap-1.5">
                        <label 
                          htmlFor="photo-file"
                          className="px-2.5 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-[10px] font-bold cursor-pointer transition-all"
                        >
                          Télécharger
                        </label>
                        {data.photo && (
                          <button
                            onClick={() => setData({ ...data, photo: '' })}
                            className="px-2 py-1 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded text-[10px] font-bold transition-all"
                          >
                            Supprimer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-slate-500 dark:text-slate-400">
                  <p className="text-[10px] leading-relaxed">
                    🚫 <strong className="text-amber-600 dark:text-amber-400">Règle anti-discrimination ({activeCountry.flag}) :</strong> Pour ce format de CV, les recruteurs refusent les photos de profil. Elle a été masquée de l'aperçu.
                  </p>
                </div>
              )}

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <User size={13} /> Nom & Prénom
                </label>
                <input 
                  type="text" 
                  value={data.name}
                  placeholder={`Ex: ${activeCountry.defaultData.name}`}
                  onChange={(e) => setData({...data, name: e.target.value})}
                  className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-slate-950 dark:text-slate-100 outline-none focus:border-blue-500 transition-all text-xs"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <FileText size={13} /> Poste ou Titre du CV
                </label>
                <input 
                  type="text" 
                  value={data.title}
                  placeholder={`Ex: ${activeCountry.defaultData.title}`}
                  onChange={(e) => setData({...data, title: e.target.value})}
                  className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-slate-950 dark:text-slate-100 outline-none focus:border-blue-500 transition-all text-xs"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <Mail size={13} /> Coordonnées & Contacts
                </label>
                <input 
                  type="text" 
                  value={data.contact}
                  placeholder={`Ex: ${activeCountry.defaultData.contact}`}
                  onChange={(e) => setData({...data, contact: e.target.value})}
                  className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-slate-950 dark:text-slate-100 outline-none focus:border-blue-500 transition-all text-xs"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <FileText size={13} /> Profil professionnel / Résumé
                </label>
                <textarea 
                  rows={3}
                  value={data.profile}
                  placeholder="Écrivez un court paragraphe sur vous..."
                  onChange={(e) => setData({...data, profile: e.target.value})}
                  className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-slate-950 dark:text-slate-100 outline-none focus:border-blue-500 transition-all resize-none text-xs"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <Briefcase size={13} /> Expériences Professionnelles
                </label>
                <textarea 
                  rows={4}
                  value={data.experience}
                  placeholder="Décrivez vos postes précédents..."
                  onChange={(e) => setData({...data, experience: e.target.value})}
                  className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-slate-950 dark:text-slate-100 outline-none focus:border-blue-500 transition-all resize-none text-xs font-mono"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <GraduationCap size={13} /> Formation & Études
                </label>
                <textarea 
                  rows={3}
                  value={data.education}
                  placeholder="Vos diplômes, écoles, dates..."
                  onChange={(e) => setData({...data, education: e.target.value})}
                  className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-slate-950 dark:text-slate-100 outline-none focus:border-blue-500 transition-all resize-none text-xs"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <FileText size={13} /> Compétences (séparées par des virgules)
                </label>
                <input 
                  type="text" 
                  value={data.skills}
                  placeholder="Ex: React, Node.js, Gestion de projet, Excel, CRM"
                  onChange={(e) => setData({...data, skills: e.target.value})}
                  className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-slate-950 dark:text-slate-100 outline-none focus:border-blue-500 transition-all text-xs"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <Globe size={13} /> Langues (séparées par des virgules)
                </label>
                <input 
                  type="text" 
                  value={data.languages}
                  placeholder="Ex: Français (Natif), Anglais (B2), Allemand"
                  onChange={(e) => setData({...data, languages: e.target.value})}
                  className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-slate-950 dark:text-slate-100 outline-none focus:border-blue-500 transition-all text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Side */}
        <div 
          ref={previewContainerRef}
          className={`flex-1 p-8 bg-slate-800 dark:bg-[#0a0c10] flex-col items-center justify-start overflow-y-auto overflow-x-hidden custom-scrollbar relative ${activeTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}
        >
          {/* Zoom & Download Toolbar */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20 gap-3">
            <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md border border-white/10 p-1 rounded-xl text-white shadow-xl">
              <button 
                onClick={() => {
                  setIsAutoZoom(false);
                  setManualZoom(prev => Math.max(0.3, prev - 0.1));
                }}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-300"
                title="Zoom arrière"
              >
                <ZoomOut size={14} />
              </button>
              
              <button
                onClick={() => setIsAutoZoom(true)}
                className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                  isAutoZoom ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Auto ({Math.round(zoom * 100)}%)
              </button>

              <button 
                onClick={() => {
                  setIsAutoZoom(false);
                  setManualZoom(prev => Math.min(1.5, prev + 0.1));
                }}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-300"
                title="Zoom avant"
              >
                <ZoomIn size={14} />
              </button>
              <div className="w-px h-3 bg-white/20 mx-1"></div>
              <button 
                onClick={() => {
                  setIsAutoZoom(false);
                  setManualZoom(0.75);
                }}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-400"
              >
                <RotateCcw size={12} />
              </button>
            </div>

            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 text-xs"
            >
              <Download size={15} />
              Télécharger PDF
            </button>
          </div>

          <div 
            className="my-16 w-full flex justify-center items-start overflow-visible"
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
                className="cv-sheet w-[794px] h-[1123px] bg-white text-[#0f172a] p-[15mm] relative shadow-2xl"
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
              <div className="p-3 border-b border-white/10 flex justify-between items-center bg-[#0d1117]">
                <h3 className="font-bold text-white text-xs">Aperçu du CV</h3>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={handleDownload}
                    className="p-1.5 bg-blue-500 text-white rounded-lg text-xs"
                  >
                    <Download size={14} />
                  </button>
                  <button 
                    onClick={() => setShowMobilePreview(false)}
                    className="p-1.5 bg-white/10 text-white rounded-lg text-xs"
                  >
                    <X size={14} />
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
                    alignItems: 'top',
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
                    <div className="w-[794px] h-[1123px] bg-white text-[#0f172a] p-[15mm] shadow-2xl">
                      {renderCV()}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
