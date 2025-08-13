import React, { memo, useMemo, useCallback } from 'react';
import { Book } from '@/types';
import BookCard from './BookCard';
import BookCardSkeleton from './BookCardSkeleton';
import { useImagePreloader } from '@/hooks/useImagePreloader';

interface OptimizedBookGridProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  isLoading?: boolean;
  className?: string;
  showSkeletons?: boolean;
  maxVisible?: number;
}

const OptimizedBookGrid: React.FC<OptimizedBookGridProps> = memo(({ 
  books, 
  onBookClick, 
  isLoading = false,
  className = '',
  showSkeletons = true,
  maxVisible = 50
}) => {
  // Use image preloader for critical images
  useImagePreloader(books, books.length > 0);
  
  // Limit visible books for performance
  const visibleBooks = useMemo(() => {
    return books.slice(0, maxVisible);
  }, [books, maxVisible]);
  
  // Memoized book click handler
  const handleBookClick = useCallback((book: Book) => {
    onBookClick(book);
  }, [onBookClick]);
  
  // Generate priority based on index
  const getImagePriority = useCallback((index: number): 'high' | 'normal' | 'low' => {
    if (index < 6) return 'high';
    if (index < 12) return 'normal';
    return 'low';
  }, []);

  if (isLoading && showSkeletons) {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${className}`}>
        {Array.from({ length: 10 }, (_, index) => (
          <BookCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (visibleBooks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-netflix-secondary">Nenhum livro encontrado</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${className}`}>
      {visibleBooks.map((book, index) => (
        <div key={`book-${book.id}`} data-book-index={index}>
          <BookCard 
            book={book} 
            onClick={() => handleBookClick(book)}
            index={index}
            priority={getImagePriority(index)}
          />
        </div>
      ))}
      {books.length > maxVisible && (
        <div className="col-span-full text-center py-4">
          <p className="text-netflix-secondary text-sm">
            Mostrando {maxVisible} de {books.length} livros
          </p>
        </div>
      )}
    </div>
  );
});

OptimizedBookGrid.displayName = 'OptimizedBookGrid';

export default OptimizedBookGrid;