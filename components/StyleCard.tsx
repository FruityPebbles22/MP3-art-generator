import React from 'react';
import { ArtStyle } from '../types';
import { STYLE_CONFIGS } from '../constants';

interface StyleCardProps {
  style: ArtStyle;
  isSelected: boolean;
  onSelect: (style: ArtStyle) => void;
}

export const StyleCard: React.FC<StyleCardProps> = ({ style, isSelected, onSelect }) => {
  const config = STYLE_CONFIGS[style];
  
  return (
    <button
      onClick={() => onSelect(style)}
      className={`
        relative overflow-hidden rounded-2xl p-4 transition-all duration-300 transform hover:scale-105 active:scale-95
        flex flex-col items-center justify-center gap-3 shadow-lg border-4
        ${isSelected ? 'border-yellow-400 rotate-1 scale-105 ring-4 ring-pink-300' : 'border-white hover:border-pink-200'}
        ${config.color} text-white
      `}
    >
      <div className="text-4xl drop-shadow-md">
        <i className={`fas ${config.icon}`}></i>
      </div>
      <span className="font-bold text-lg drop-shadow-md text-center leading-tight">
        {config.label}
      </span>
      {isSelected && (
        <div className="absolute top-2 right-2 text-yellow-300 animate-pulse">
          <i className="fas fa-star"></i>
        </div>
      )}
    </button>
  );
};
