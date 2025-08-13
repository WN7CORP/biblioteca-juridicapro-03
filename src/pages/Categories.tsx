import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useLibrary } from '@/contexts/LibraryContext';
import MobileNav from '@/components/MobileNav';
import Header from '@/components/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft, Sparkles, Filter } from 'lucide-react';
import EnhancedBookGrid from '@/components/EnhancedBookGrid';
import ViewToggle from '@/components/ViewToggle';
import BookDetailsModal from '@/components/BookDetailsModal';
import CategoryHeroSection from '@/components/CategoryHeroSection';
import SimpleCategoryCard from '@/components/SimpleCategoryCard';
import { highlightBook } from '@/utils/navigationUtils';
const Categories: React.FC = () => {
  const {
    books
  } = useLibrary();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const {
    areaName
  } = useParams<{
    areaName?: string;
  }>();
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightedBookId, setHighlightedBookId] = useState<number | null>(null);

  // Check if we came from AI search with a book to highlight
  useEffect(() => {
    const state = location.state as any;
    if (state?.highlightedBookId) {
      setHighlightedBookId(state.highlightedBookId);
      
      // Navigate to the correct area if specified
      if (state.targetArea && state.targetArea !== areaName) {
        navigate(`/categories/${encodeURIComponent(state.targetArea)}`);
        return;
      }
      
      // Wait for books to load and highlight
      const timer = setTimeout(() => {
        highlightBook(state.highlightedBookId);
      }, 500);
      
      // Clear highlight after 3 seconds  
      setTimeout(() => {
        setHighlightedBookId(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state, navigate, areaName]);

  // Get areas and count books in each area
  const areaStats = books.reduce((acc: Record<string, number>, book) => {
    if (!acc[book.area]) {
      acc[book.area] = 0;
    }
    acc[book.area]++;
    return acc;
  }, {});

  // Sort areas by book count (most popular first)
  const sortedAreas = Object.entries(areaStats).sort(([, countA], [, countB]) => countB - countA);

  // Filter books by selected area if any
  const filteredBooks = areaName ? books.filter(book => book.area === areaName) : [];
  const handleAreaClick = (area: string) => {
    navigate(`/categories/${encodeURIComponent(area)}`);
  };
  const handleBookClick = book => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };
  return <div className="min-h-screen bg-azure-background text-azure-text">
      {isMobile ? <MobileNav /> : <Header />}
      <div className={`container mx-auto px-4 ${isMobile ? 'pt-20' : 'pt-24'} pb-16`}>
        {areaName ? <>
            {/* Area specific view - Modern header */}
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => navigate('/categories')} className="flex items-center text-azure-accent hover:text-azure-accentHover transition-colors duration-200 group bg-azure-card hover:bg-azure-cardHover px-4 py-2 rounded-xl border border-azure-border">
                  <ArrowLeft size={18} className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
                  <span className="font-medium">Voltar</span>
                </button>
                
                {location.state?.searchQuery && <div className="flex items-center text-sm text-azure-accent bg-gradient-to-r from-azure-accent/10 to-azure-accent/5 px-4 py-2 rounded-xl border border-azure-accent/20 backdrop-blur-sm">
                    <Sparkles size={14} className="mr-2" />
                    <span>Busca: "{location.state.searchQuery}"</span>
                  </div>}
              </div>

              
            </div>
            
            <div className="flex justify-end mb-6">
              <ViewToggle />
            </div>
            
            <EnhancedBookGrid books={filteredBooks} onBookClick={handleBookClick} />
          </> : <>
            {/* Categories overview - Modern design */}
            <CategoryHeroSection />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedAreas.map(([area, count], index) => {
            const areaBooks = books.filter(book => book.area === area);
            return <SimpleCategoryCard key={area} area={area} count={count} books={areaBooks} index={index} onClick={handleAreaClick} />;
          })}
            </div>

            {sortedAreas.length === 0 && <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 bg-azure-card rounded-full flex items-center justify-center">
                  <Filter className="text-azure-secondary" size={32} />
                </div>
                <div className="text-azure-secondary text-xl font-medium">
                  Nenhuma categoria disponível
                </div>
                <p className="text-azure-secondary/70 text-sm mt-2">
                  As categorias aparecerão aqui quando houver livros disponíveis
                </p>
              </div>}
          </>}
      </div>
      
      <BookDetailsModal book={selectedBook} isOpen={isModalOpen} onClose={closeModal} />
    </div>;
};
export default Categories;