import React, { useState } from 'react';
import { useLibrary } from '@/contexts/LibraryContext';
import { Book } from '@/types';
import EnhancedBookGrid from './EnhancedBookGrid';
import BookDetailsModal from './BookDetailsModal';
import { TrendingUp, Clock, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ViewToggle from './ViewToggle';
const FeaturedBooksSection: React.FC = () => {
  const {
    books
  } = useLibrary();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Get featured books (most popular areas)
  const popularAreas = ['Direito Civil', 'Direito Penal', 'Direito Constitucional', 'Direito do Trabalho'];
  const featuredBooks = books.filter(book => popularAreas.includes(book.area)).slice(0, 8);

  // Get recent books (simulating new additions)
  const recentBooks = books.sort(() => 0.5 - Math.random()).slice(0, 6);
  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };
  return <div id="featured-books" className="mb-12">
      {/* View Controls */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-azure-text">
          Biblioteca Completa
        </h2>
        <ViewToggle />
      </div>

      {/* All Books */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <TrendingUp className="mr-3 text-azure-accent" size={28} />
            <div>
              <h3 className="text-xl font-bold text-azure-text">
                Livros em Destaque
              </h3>
              <p className="text-azure-secondary text-sm">
                Os livros mais procurados pelos estudantes de Direito
              </p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/categories')} 
            variant="ghost" 
            className="text-azure-accent hover:text-azure-text hover:bg-azure-accent/10"
          >
            Ver todos
          </Button>
        </div>
        
        <EnhancedBookGrid
          books={featuredBooks}
          onBookClick={handleBookClick}
        />
      </div>

      {/* New Additions */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Clock className="mr-3 text-azure-accent" size={28} />
            <div>
              <h3 className="text-xl font-bold text-azure-text">
                Recém Adicionados
              </h3>
              <p className="text-azure-secondary text-sm">
                Novos materiais para enriquecer seus estudos
              </p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/categories')} 
            variant="ghost" 
            className="text-azure-accent hover:text-azure-text hover:bg-azure-accent/10"
          >
            Explorar mais
          </Button>
        </div>
        
        <EnhancedBookGrid
          books={recentBooks.map(book => ({ ...book, isNew: true }))}
          onBookClick={handleBookClick}
        />
      </div>

      <BookDetailsModal book={selectedBook} isOpen={isModalOpen} onClose={closeModal} />
    </div>;
};
export default FeaturedBooksSection;