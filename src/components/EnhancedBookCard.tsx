
import React, { useState, useCallback } from 'react';
import { Heart, BookOpen, Download, Eye } from 'lucide-react';
import { Book } from '@/types';
import { useLibrary } from '@/contexts/LibraryContext';
import { useToast } from '@/hooks/use-toast';
import LazyImage from './LazyImage';
import { Badge } from '@/components/ui/badge';

interface EnhancedBookCardProps {
  book: Book;
  onClick: (book: Book) => void;
  size?: 'small' | 'medium' | 'large';
}

const EnhancedBookCard: React.FC<EnhancedBookCardProps> = ({
  book,
  onClick,
  size = 'medium'
}) => {
  const { toggleFavorite } = useLibrary();
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    
    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    toggleFavorite(book.id);
    
    setTimeout(() => setIsAnimating(false), 600);
  }, [book.id, toggleFavorite]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleDownload = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (book.download) {
      window.open(book.download, '_blank');
      toast({
        title: "Download iniciado",
        description: book.livro,
      });
    }
  }, [book.download, book.livro, toast]);

  const sizeClasses = {
    small: 'aspect-[3/4]',
    medium: 'aspect-[3/4.2]',
    large: 'aspect-[3/4.5]'
  };

  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div 
      data-book-id={book.id}
      className={`
        relative group cursor-pointer transition-all duration-300 ease-out
        transform hover:scale-105 hover:z-10
        bg-azure-card rounded-xl overflow-hidden
        border border-azure-border hover:border-azure-accent/50
        shadow-lg hover:shadow-2xl hover:shadow-azure-accent/20
      `}
      onClick={() => onClick(book)}
    >
      {/* Book Cover */}
      <div className={`relative ${sizeClasses[size]} overflow-hidden`}>
        {imageError ? (
          <div className="w-full h-full bg-gradient-to-br from-azure-accent/20 to-azure-muted flex items-center justify-center">
            <BookOpen className="text-azure-accent opacity-50" size={size === 'large' ? 48 : size === 'medium' ? 32 : 24} />
          </div>
        ) : (
          <LazyImage
            src={book.imagem}
            alt={book.livro}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={handleImageError}
            priority="low"
          />
        )}
        
        {/* Hover overlay para ações */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Action Buttons */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex gap-2">
            {book.download && (
              <button
                onClick={handleDownload}
                className="p-2 bg-azure-accent/90 text-white rounded-full hover:bg-azure-accentHover transition-colors duration-200"
                title="Download"
              >
                <Download size={16} />
              </button>
            )}
            <button
              className="p-2 bg-azure-accent/90 text-white rounded-full hover:bg-azure-accentHover transition-colors duration-200"
              title="Ver detalhes"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`
            absolute top-2 right-2 p-2 rounded-full transition-all duration-300 z-10
            ${isAnimating ? 'animate-bounce' : ''}
            ${book.favorito 
              ? 'bg-azure-accent/90 text-white shadow-lg' 
              : 'bg-black/50 text-gray-300 hover:bg-azure-accent/70 hover:text-white'
            }
          `}
          title={book.favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart size={16} className={book.favorito ? 'fill-current' : ''} />
        </button>

        {/* New Badge */}
        {book.isNew && (
          <Badge 
            className="absolute top-2 left-2 bg-green-500 text-white"
            variant="secondary"
          >
            Novo
          </Badge>
        )}

        {/* Progress Bar */}
        {book.progresso > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <div 
              className="h-full bg-azure-accent transition-all duration-300"
              style={{ width: `${book.progresso}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-3 space-y-2">
        <h3 className={`font-semibold text-azure-text leading-tight line-clamp-2 ${textSizes[size]}`}>
          {book.livro}
        </h3>
        
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={`border-azure-accent/30 text-azure-accent ${size === 'small' ? 'text-xs' : 'text-xs'}`}
          >
            {book.area}
          </Badge>
          
          {book.progresso > 0 && (
            <span className="text-xs text-azure-secondary">
              {book.progresso}%
            </span>
          )}
        </div>

        {size === 'large' && book.sobre && (
          <p className="text-xs text-azure-secondary line-clamp-2 leading-relaxed">
            {book.sobre}
          </p>
        )}
      </div>
    </div>
  );
};

export default EnhancedBookCard;
