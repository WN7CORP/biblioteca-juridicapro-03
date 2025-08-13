import React from 'react';
import { Book } from '@/types';
import EnhancedBookCard from './EnhancedBookCard';
import BookList from './BookList';
import CompactBookCard from './CompactBookCard';
import { useView } from '@/contexts/ViewContext';
import { motion } from 'framer-motion';

interface EnhancedBookGridProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  isLoading?: boolean;
  title?: string;
}

const EnhancedBookGrid: React.FC<EnhancedBookGridProps> = ({
  books,
  onBookClick,
  isLoading = false,
  title
}) => {
  const { viewMode } = useView();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {title && <h2 className="text-2xl font-bold text-azure-text mb-6">{title}</h2>}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse"
            >
              <div className="bg-azure-muted rounded-lg aspect-[3/4] mb-3"></div>
              <div className="h-4 bg-azure-muted rounded mb-2"></div>
              <div className="h-3 bg-azure-muted/70 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-azure-secondary text-lg">
          Nenhum livro encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-2xl font-bold text-azure-text mb-6">{title}</h2>
      )}
      
      {viewMode === 'list' ? (
        <BookList
          books={books}
          onBookClick={onBookClick}
        />
      ) : (
        <div className="grid gap-4 auto-rows-fr grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
            >
              <CompactBookCard
                book={book}
                onClick={() => onBookClick(book)}
                size="sm"
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedBookGrid;