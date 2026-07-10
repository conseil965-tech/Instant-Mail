import { motion } from 'motion/react';

interface AdSensePlaceholderProps {
  className?: string;
  type: 'horizontal' | 'vertical' | 'rectangle';
  label?: string;
}

export function AdSensePlaceholder({ className = '', type, label = 'Google AdSense' }: AdSensePlaceholderProps) {
  const dimensions = {
    horizontal: 'w-full h-[60px] sm:h-[90px] md:h-[120px]',
    vertical: 'w-full h-[300px] lg:w-[280px] lg:h-[600px]',
    rectangle: 'w-full h-[250px]',
  };

  return (
    <div className={`relative flex flex-col items-center justify-center bg-black/5 dark:bg-black/40 border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden group hover:bg-black/10 dark:hover:bg-black/60 transition-all duration-500 ${dimensions[type]} ${className}`}>
      <div className="relative z-10 flex flex-col items-center gap-1">
        <div className="px-3 py-1 bg-black/5 dark:bg-white/5 rounded text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
          {label}
        </div>
      </div>
      
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex flex-col gap-2 p-6">
        <div className="h-2 bg-black dark:bg-white w-2/3 rounded-full"></div>
        <div className="h-2 bg-black dark:bg-white w-full rounded-full"></div>
        <div className="h-2 bg-black dark:bg-white w-1/2 rounded-full"></div>
      </div>
    </div>
  );
}
