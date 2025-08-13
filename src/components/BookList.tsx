
import React, { useState } from 'react';
import { Book } from '@/types';
import { Heart, ExternalLink } from 'lucide-react';
import { useLibrary } from '@/contexts/LibraryContext';
import { useToast } from '@/hooks/use-toast';
import LazyImage from './LazyImage';

interface BookListProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  highlightedBookId?: number | null;
}

const BookList: React.FC<BookListProps> = ({ books, onBookClick, highlightedBookId }) => {
  const { toggleFavorite } = useLibrary();
  const { toast } = useToast();
  const [animatingBookId, setAnimatingBookId] = useState<number | null>(null);

  const handleFavoriteClick = async (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    
    try {
      // Enhanced animation for mobile
      setAnimatingBookId(book.id);
      setTimeout(() => setAnimatingBookId(null), 800);
      
      await toggleFavorite(book.id);
      
      toast({
        title: book.favorito ? "Removido dos favoritos" : "❤️ Adicionado aos favoritos",
        description: book.livro,
        duration: 2000,
      });
    } catch (error) {
      console.error('Erro ao favoritar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar favoritos. Tente novamente.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-10 animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-4 bg-netflix-cardHover rounded-full flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-netflix-secondary rounded opacity-50" />
        </div>
        <p className="text-netflix-secondary text-lg mb-2">Nenhum livro encontrado</p>
        <p className="text-netflix-secondary/70 text-sm">Tente ajustar os filtros ou explore outras categorias</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {books.map((book, index) => {
        const isAnimating = animatingBookId === book.id;
        const isHighlighted = highlightedBookId === book.id;
        
        return (
          <div
            key={book.id}
            data-book-id={book.id}
            className={`bg-azure-card hover:bg-azure-cardHover border transition-all duration-300 animate-fade-in group cursor-pointer rounded-lg overflow-hidden ${
              isHighlighted 
                ? 'border-azure-accent ring-2 ring-azure-accent ring-offset-2 ring-offset-azure-background animate-pulse' 
                : 'border-azure-border hover:border-azure-accent'
            }`}
            onClick={() => onBookClick(book)}
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'both'
            }}
          >
            <div className="flex items-start">
              {/* Capa do livro */}
              <div className="flex-shrink-0 w-32 h-44">
                <LazyImage 
                  src={book.imagem} 
                  alt={book.livro}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Informações do livro */}
              <div className="flex-grow p-6 flex flex-col justify-between min-h-[176px]">
                <div>
                  <h3 className="font-bold text-lg text-azure-text group-hover:text-azure-accent transition-colors mb-2 line-clamp-2">
                    {book.livro}
                  </h3>
                  <p className="text-azure-secondary mb-3 font-medium">
                    {book.area}
                  </p>
                  
                  {/* Progress bar se existir */}
                  {book.progresso > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-azure-secondary mb-1">
                        <span>Progresso</span>
                        <span>{book.progresso}%</span>
                      </div>
                      <div className="w-full bg-azure-muted rounded-full h-2">
                        <div 
                          className="bg-azure-accent rounded-full h-2 transition-all duration-300"
                          style={{ width: `${book.progresso}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-azure-accent/20 text-azure-accent px-2 py-1 rounded-full">
                      100% Atualizado
                    </span>
                    {book.isNew && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                        Novo
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Botão de favorito */}
                <div className="flex justify-end">
                  <button
                    onClick={(e) => handleFavoriteClick(e, book)}
                    className={`relative p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                      book.favorito 
                        ? 'bg-azure-accent/90 backdrop-blur-sm' 
                        : 'bg-azure-muted hover:bg-azure-border'
                    }`}
                  >
                    <Heart 
                      size={18} 
                      className={`transition-all duration-500 ${
                        book.favorito 
                          ? 'text-white fill-white' 
                          : 'text-azure-secondary hover:text-azure-accent'
                      } ${
                        isAnimating 
                          ? 'animate-bounce scale-125' 
                          : ''
                      }`}
                      style={{
                        filter: isAnimating ? 'drop-shadow(0 0 12px rgba(54, 162, 235, 0.8))' : 'none'
                      }}
                    />
                    
                    {/* Enhanced Animation for Mobile */}
                    {isAnimating && (
                      <div className="absolute inset-0 rounded-full">
                        <div className="absolute inset-0 rounded-full bg-azure-accent/40 animate-ping" />
                        <div className="absolute inset-0 rounded-full bg-azure-accent/30 animate-ping" style={{ animationDelay: '0.1s' }} />
                        <div className="absolute inset-0 rounded-full bg-azure-accent/20 animate-ping" style={{ animationDelay: '0.2s' }} />
                        <div className="absolute inset-0 rounded-full bg-azure-accent/10 animate-ping" style={{ animationDelay: '0.3s' }} />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookList;
