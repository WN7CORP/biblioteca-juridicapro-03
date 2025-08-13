
import React from 'react';
import { Book, ArrowRight, BookOpen } from 'lucide-react';
import { Book as BookType } from '@/types';

interface SimpleCategoryCardProps {
  area: string;
  count: number;
  books: BookType[];
  index: number;
  onClick: (area: string) => void;
}

const SimpleCategoryCard: React.FC<SimpleCategoryCardProps> = ({ 
  area, 
  count, 
  index, 
  onClick 
}) => {
  const colorSchemes = [
    {
      gradient: "from-red-500/90 to-pink-600/90",
      accent: "bg-red-500/20",
      border: "border-red-500/30",
      icon: "text-red-400"
    },
    {
      gradient: "from-blue-500/90 to-cyan-500/90", 
      accent: "bg-blue-500/20",
      border: "border-blue-500/30",
      icon: "text-blue-400"
    },
    {
      gradient: "from-green-500/90 to-emerald-600/90",
      accent: "bg-green-500/20",
      border: "border-green-500/30",
      icon: "text-green-400"
    },
    {
      gradient: "from-purple-500/90 to-indigo-600/90",
      accent: "bg-purple-500/20",
      border: "border-purple-500/30",
      icon: "text-purple-400"
    },
    {
      gradient: "from-yellow-500/90 to-orange-500/90",
      accent: "bg-yellow-500/20",
      border: "border-yellow-500/30",
      icon: "text-yellow-400"
    },
    {
      gradient: "from-teal-500/90 to-green-500/90",
      accent: "bg-teal-500/20",
      border: "border-teal-500/30",
      icon: "text-teal-400"
    }
  ];
  
  const colorScheme = colorSchemes[index % colorSchemes.length];

  return (
    <div
      className="group cursor-pointer animate-fade-in"
      onClick={() => onClick(area)}
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both'
      }}
    >
      <div className={`
        relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorScheme.gradient}
        backdrop-blur-sm border ${colorScheme.border}
        p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
        h-36 group-hover:shadow-xl
      `}>
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full text-white">
          <div className="flex items-start justify-between">
            <div className={`
              w-12 h-12 rounded-xl ${colorScheme.accent} backdrop-blur-sm
              flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300
            `}>
              <BookOpen size={24} className={colorScheme.icon} />
            </div>
            
            <div className="transform group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300 opacity-70 group-hover:opacity-100">
              <ArrowRight size={24} />
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg leading-tight mb-2 group-hover:scale-105 transition-transform duration-300 drop-shadow-sm">
              {area}
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="text-sm opacity-90 font-medium">
                {count} {count === 1 ? 'livro' : 'livros'}
              </div>
              
              <div className="flex items-center text-xs opacity-75">
                <Book size={12} className="mr-1" />
                <span>Explorar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
};

export default SimpleCategoryCard;
