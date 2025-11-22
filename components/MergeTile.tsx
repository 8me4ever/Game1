
import React from 'react';
import { MergeItemDef, ItemCategory } from '../types';
import * as Icons from 'lucide-react';

interface MergeTileProps {
  item: MergeItemDef;
  isSelected?: boolean;
  onClick: () => void;
  isDraggable?: boolean;
  imageUrl?: string; // Generated image URL
}

export const MergeTile: React.FC<MergeTileProps> = ({ item, isSelected, onClick, isDraggable = true, imageUrl }) => {
  // Dynamic Icon rendering (Fallback)
  const IconComponent = (Icons as any)[item.icon] || Icons.HelpCircle;

  const isGenerator = item.category === ItemCategory.GENERATOR_ARCHIVE || item.category === ItemCategory.GENERATOR_ALTAR;
  
  // Generator pulsing effect
  const generatorClass = isGenerator 
    ? "border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-pulse bg-slate-900" 
    : "border border-slate-700 bg-slate-800 shadow-md";

  const selectedClass = isSelected 
    ? "ring-2 ring-red-600 z-10 scale-110 shadow-[0_0_10px_rgba(220,38,38,0.5)]" 
    : "";

  // Color adjustment for dark mode visibility
  const iconColor = isGenerator ? item.color : item.color.replace('text-', 'text-');

  return (
    <div
      onClick={onClick}
      className={`
        w-full h-full rounded-lg flex flex-col items-center justify-center 
        transition-all duration-200 cursor-pointer relative overflow-hidden
        ${generatorClass} ${selectedClass}
        hover:scale-105 active:scale-95
      `}
      title={item.name}
    >
      {/* If we have a generated image, show it. Otherwise show the icon */}
      {imageUrl ? (
        <img src={imageUrl} alt={item.name} className="w-full h-full object-cover opacity-90" />
      ) : (
        <div className={`p-2 rounded-full bg-opacity-20 bg-black ${isSelected ? 'animate-bounce' : ''}`}>
          <IconComponent size={isGenerator ? 28 : 24} className={item.color} strokeWidth={2} />
        </div>
      )}
      
      {!isGenerator && (
        <span className="absolute bottom-0.5 right-1 text-[9px] font-bold text-white bg-black/50 px-1.5 rounded-full backdrop-blur-sm border border-slate-600">
          {item.level}
        </span>
      )}
      
      {isGenerator && (
        <div className="absolute -top-1 -right-1 z-10">
          <Icons.Sparkles size={12} className="fill-purple-500 text-purple-200" />
        </div>
      )}
    </div>
  );
};
