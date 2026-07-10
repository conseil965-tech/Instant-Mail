import { motion } from 'motion/react';

interface AdSensePlaceholderProps {
  className?: string;
  type: 'horizontal' | 'vertical' | 'rectangle';
  label?: string;
}

export function AdSensePlaceholder({ className = '', type, label = 'Google AdSense' }: AdSensePlaceholderProps) {
  const dimensions = {
    horizontal: 'w-full h-[100px] sm:h-[120px] lg:h-[150px]',
    vertical: 'w-full h-[400px] lg:w-[300px] lg:h-[600px]',
    rectangle: 'w-full h-[250px] md:h-[320px]',
  };

  return (
    <div className={`relative flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-3xl overflow-hidden group hover:bg-white/10 transition-all duration-500 ${dimensions[type]} ${className}`}>
      {/* Dynamic background element */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] group-hover:text-white group-hover:bg-indigo-500/20 transition-all duration-300">
          {label}
        </div>
        <div className="text-[9px] text-text-muted/40 font-mono tracking-widest uppercase">
          Ads by Google
        </div>
      </div>
      
      {/* Decorative lines to simulate ad structure */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex flex-col gap-3 p-6">
        <div className="h-3 bg-white w-2/3 rounded-full"></div>
        <div className="h-2 bg-white w-full rounded-full"></div>
        <div className="h-2 bg-white w-4/5 rounded-full"></div>
        <div className="h-10 bg-white w-1/3 rounded-xl mt-auto self-end"></div>
      </div>
      
      {/* Interaction corner accent */}
      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-indigo-400 transition-colors" />
    </div>
  );
}
