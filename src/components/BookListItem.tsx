
import React, { useState, useCallback } from 'react';
import { Heart, BookOpen } from 'lucide-react';
import { Book } from '@/types';
import { useLibrary } from '@/contexts/LibraryContext';
import { useToast } from '@/hooks/use-toast';
import LazyImage from './LazyImage';

interface BookListItemProps {
  book: Book;
  onClick: (book: Book) => void;
}

const BookListItem: React.FC<BookListItemProps> = ({ book, onClick }) => {
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

  return (
    <div 
      className="
        bg-azure-card border border-azure-border 
        rounded-lg hover:border-azure-accent/50 hover:bg-azure-cardHover 
        transition-all duration-300 cursor-pointer group
        shadow-sm hover:shadow-lg hover:shadow-azure-accent/10
        aspect-[3/4] p-0 flex flex-col justify-center
      "
      onClick={() => onClick(book)}
    >
      {/* Book Thumbnail */}
      <div className="relative w-full h-full rounded overflow-hidden">
        {imageError ? (
          <div className="w-full h-full bg-gradient-to-br from-azure-accent/20 to-azure-muted flex items-center justify-center">
            <BookOpen className="text-azure-accent opacity-50" size={24} />
          </div>
        ) : (
          <LazyImage
            src={book.imagem}
            alt={book.livro}
            className="w-full h-full object-contain bg-azure-muted/20 md:object-cover"
            onError={handleImageError}
            priority="low"
          />
        )}
        
        {/* Progress indicator */}
        {book.progresso > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <div 
              className="h-full bg-azure-accent transition-all duration-300"
              style={{ width: `${book.progresso}%` }}
            ></div>
          </div>
        )}
      </div>

    </div>
  );
};

export default BookListItem;
