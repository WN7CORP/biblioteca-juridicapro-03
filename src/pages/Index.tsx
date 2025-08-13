
import React, { useState, useMemo, useEffect } from 'react';
import { useLibrary } from '@/contexts/LibraryContext';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import BookDetailsModal from '@/components/BookDetailsModal';
import MobileNav from '@/components/MobileNav';
import GlobalSearchBar from '@/components/GlobalSearchBar';
import { Book } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { TrendingUp, Clock, Star, BookOpen, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EnhancedBookGrid from '@/components/EnhancedBookGrid';
import { useView } from '@/contexts/ViewContext';
import ViewToggle from '@/components/ViewToggle';
import { motion } from 'framer-motion';
import { highlightBook } from '@/utils/navigationUtils';

const Index = () => {
  const { books, isLoading } = useLibrary();
  const location = useLocation();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const isMobile = useIsMobile();
  const { viewMode } = useView();

  // Handle navigation state for highlighting books
  useEffect(() => {
    const state = location.state as any;
    if (state?.highlightedBookId) {
      // Wait for books to load and DOM to update
      const timer = setTimeout(() => {
        highlightBook(state.highlightedBookId);
        
        // Filter by area if specified
        if (state.targetArea) {
          setSelectedCategory(state.targetArea);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [location.state, books]);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Get categories and organize books
  const categories = useMemo(() => {
    const areas = [...new Set(books.map(book => book.area))];
    return areas.slice(0, 8); // Top 8 categories
  }, [books]);

  const filteredBooks = useMemo(() => {
    if (selectedCategory === 'all') return books;
    return books.filter(book => book.area === selectedCategory);
  }, [books, selectedCategory]);

  // Get featured books by category
  const featuredBooks = useMemo(() => books.slice(0, 12), [books]);
  const recentBooks = useMemo(() => books.filter(book => book.isNew).slice(0, 8), [books]);
  const popularBooks = useMemo(() => books.filter(book => book.favorito).slice(0, 8), [books]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-azure-background text-azure-text flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-azure-accent mx-auto mb-4"></div>
          <p className="text-azure-secondary">Carregando biblioteca...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-azure-background text-azure-text">
      {isMobile ? <MobileNav /> : <Header />}
      
      <div className={`${isMobile ? 'pt-4 pb-24' : 'pt-20'}`}>
        {/* Compact Header with Search */}
        <div className="bg-azure-background border-b border-azure-border">
          <div className="container mx-auto px-4 py-4">
            {/* Title and Stats Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-azure-text mb-1">
                Clássicos Jurídicos
              </h1>
                <div className="flex items-center gap-4 text-sm text-azure-secondary">
                  <span>{books.length} livros</span>
                  <span>•</span>
                  <span>{categories.length} áreas</span>
                  <span>•</span>
                  <span>Acesso gratuito</span>
                </div>
              </div>
              <ViewToggle />
            </div>
            
            {/* Global Search Bar */}
            <GlobalSearchBar placeholder="Buscar livros, autores ou áreas do direito..." />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="bg-azure-background border-b border-azure-border/50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="whitespace-nowrap"
              >
                Todos os livros
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 space-y-8">
          {/* Main Books Grid */}
          {selectedCategory === 'all' ? (
            <>
              {/* Featured Section */}
              {featuredBooks.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="text-azure-accent" size={24} />
                      <div>
                        <h2 className="text-xl font-bold text-azure-text">
                          Livros em Destaque
                        </h2>
                        <p className="text-sm text-azure-secondary">
                          Os mais procurados pelos estudantes
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <EnhancedBookGrid
                    books={featuredBooks}
                    onBookClick={handleBookClick}
                  />
                </motion.section>
              )}

              {/* Recent Additions */}
              {recentBooks.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="text-azure-accent" size={24} />
                    <div>
                      <h2 className="text-xl font-bold text-azure-text">
                        Recém Adicionados
                      </h2>
                      <p className="text-sm text-azure-secondary">
                        Novos materiais para seus estudos
                      </p>
                    </div>
                  </div>
                  
                  <EnhancedBookGrid
                    books={recentBooks}
                    onBookClick={handleBookClick}
                  />
                </motion.section>
              )}

              {/* Popular Books */}
              {popularBooks.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <Star className="text-azure-accent" size={24} />
                    <div>
                      <h2 className="text-xl font-bold text-azure-text">
                        Mais Favoritos
                      </h2>
                      <p className="text-sm text-azure-secondary">
                        Preferidos da comunidade
                      </p>
                    </div>
                  </div>
                  
                  <EnhancedBookGrid
                    books={popularBooks}
                    onBookClick={handleBookClick}
                  />
                </motion.section>
              )}

              {/* All Books */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="text-azure-accent" size={24} />
                  <div>
                    <h2 className="text-xl font-bold text-azure-text">
                      Todos os Livros
                    </h2>
                    <p className="text-sm text-azure-secondary">
                      Explore toda nossa biblioteca
                    </p>
                  </div>
                </div>
                
                <EnhancedBookGrid
                  books={books}
                  onBookClick={handleBookClick}
                />
              </motion.section>
            </>
          ) : (
            /* Filtered Category Results */
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Filter className="text-azure-accent" size={24} />
                  <div>
                    <h2 className="text-xl font-bold text-azure-text">
                      {selectedCategory}
                    </h2>
                    <p className="text-sm text-azure-secondary">
                      {filteredBooks.length} livros encontrados
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="border-azure-accent text-azure-accent">
                  {filteredBooks.length}
                </Badge>
              </div>
              
              <EnhancedBookGrid
                books={filteredBooks}
                onBookClick={handleBookClick}
              />
            </motion.section>
          )}
        </div>
      </div>
      
      <BookDetailsModal 
        book={selectedBook} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </div>
  );
};

export default Index;
