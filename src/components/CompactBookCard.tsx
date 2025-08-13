
import React, { useState, useCallback } from 'react';
import { Heart, BookOpen, Star } from 'lucide-react';
import { Book } from '@/types';
import { useLibrary } from '@/contexts/LibraryContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LazyImage from './LazyImage';
import { motion } from 'framer-motion';

interface CompactBookCardProps {
  book: Book;
  onClick: (book: Book) => void;
  size?: 'xs' | 'sm' | 'md';
}

const CompactBookCard: React.FC<CompactBookCardProps> = ({ 
  book, 
  onClick,
  size = 'sm' 
}) => {
  const { toggleFavorite } = useLibrary();
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    toggleFavorite(book.id);
    setTimeout(() => setIsAnimating(false), 600);
  }, [book.id, toggleFavorite]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const sizeClasses = {
    xs: 'w-20 h-28',
    sm: 'w-24 h-32', 
    md: 'w-32 h-44'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base'
  };

  return (
    <motion.div 
      data-book-id={book.id}
      className="
        group bg-black border border-gray-800 rounded-lg overflow-hidden
        hover:border-azure-accent/50 hover:bg-gray-900/50
        transition-all duration-300 cursor-pointer
        shadow-sm hover:shadow-lg hover:shadow-azure-accent/10
        h-full flex flex-col aspect-[3/4]
      "
      onClick={() => onClick(book)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Book Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {imageError ? (
          <div className="w-full h-full bg-gradient-to-br from-azure-accent/20 to-azure-muted flex items-center justify-center">
            <BookOpen className="text-azure-accent opacity-50" size={size === 'xs' ? 16 : size === 'sm' ? 20 : 24} />
          </div>
        ) : (
          <LazyImage
            src={book.imagem}
            alt={book.livro}
            className="w-full h-full object-cover"
            onError={handleImageError}
            priority="low"
          />
        )}
        
        {/* Favorite Button Overlay */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFavoriteClick}
          className={`
            absolute top-1 right-1 p-1 h-auto w-auto opacity-0 group-hover:opacity-100
            transition-all duration-300 bg-black/60 hover:bg-black/80
            ${isAnimating ? 'animate-bounce' : ''}
          `}
        >
          <Heart 
            size={size === 'xs' ? 12 : 14} 
            className={`${book.favorito ? 'fill-azure-accent text-azure-accent' : 'text-white'}`} 
          />
        </Button>

        {/* Progress Bar */}
        {book.progresso > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <div 
              className="h-full bg-azure-accent transition-all duration-300"
              style={{ width: `${book.progresso}%` }}
            ></div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-1 left-1 flex flex-col gap-1">
          {book.isNew && (
            <Badge className="bg-green-500 text-white text-xs px-1 py-0">
              Novo
            </Badge>
          )}
          {book.favorito && (
            <Badge className="bg-azure-accent text-white text-xs px-1 py-0">
              <Star size={10} className="mr-1" />
              Top
            </Badge>
          )}
        </div>
      </div>

    </motion.div>
  );
};

export default CompactBookCard;
