
import React from 'react';
import { Star, Skull, Ghost } from 'lucide-react';

interface RenovationViewProps {
  stars: number;
  completedTaskCount: number;
}

export const RenovationView: React.FC<RenovationViewProps> = ({ stars, completedTaskCount }) => {
  // Logic to reveal elements of the haunted house based on stars
  const revealLevel = Math.min(stars, 20); 
  
  // Calculate opacity of the "ghost" based on progress
  const ghostOpacity = Math.min(revealLevel * 0.1, 1);
  const fogIntensity = Math.max(1 - (revealLevel * 0.05), 0.2);

  return (
    <div className="w-full h-56 bg-slate-900 relative overflow-hidden border-b-4 border-slate-800 shadow-2xl">
      
      {/* Background: Dark Hallway */}
      <div className="absolute inset-0 bg-black">
        {/* Spooky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black opacity-90" />
        
        {/* The "Corridor" perspective */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-full bg-slate-950 border-x-[20px] border-slate-900 transform perspective-lg shadow-inner" 
             style={{boxShadow: 'inset 0 0 50px #000'}}></div>
      </div>

      {/* Interactive Elements unlocked by stars */}
      
      {/* 1. The Ghost (appears gradually) */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000"
        style={{ opacity: ghostOpacity }}
      >
        <Ghost size={64} className="text-cyan-100 opacity-60 animate-pulse blur-[1px]" />
      </div>

      {/* 2. Red Eyes in the dark (appear early) */}
      <div className={`absolute top-20 left-10 flex space-x-1 transition-opacity duration-1000 ${revealLevel > 2 ? 'opacity-100' : 'opacity-0'}`}>
         <div className="w-1 h-1 bg-red-600 rounded-full shadow-[0_0_5px_red]"></div>
         <div className="w-1 h-1 bg-red-600 rounded-full shadow-[0_0_5px_red]"></div>
      </div>

      {/* 3. Blood Stain (mid game) */}
      <div className={`absolute bottom-0 right-12 transform rotate-12 transition-all duration-1000 ${revealLevel > 8 ? 'opacity-80' : 'opacity-0'}`}>
         <Skull size={32} className="text-red-900 opacity-40" />
      </div>

      {/* Fog Overlay - gets thinner as you progress (clean the house/exorcise) */}
      <div className="absolute inset-0 bg-slate-500 mix-blend-overlay pointer-events-none transition-opacity duration-1000" 
           style={{ opacity: fogIntensity }}></div>

      {/* Header Info Overlay */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
         <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-sm flex items-center gap-1 shadow-sm border border-red-900/50">
            <Star size={16} className="fill-red-600 text-red-700" />
            <span className="font-bold text-red-100 font-creep tracking-widest text-lg">{stars}</span>
         </div>
      </div>
      
      {/* Title / Chapter */}
      <div className="absolute top-4 left-4 z-20">
        <h1 className="text-2xl text-slate-200 font-creep tracking-wider text-shadow-red">第 {Math.floor(stars / 5) + 1} 章</h1>
        <p className="text-xs text-slate-400 font-serif italic">低语长廊</p>
      </div>

    </div>
  );
};
