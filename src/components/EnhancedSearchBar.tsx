import React, { useState, useMemo } from 'react';
import { Search, X, Filter, BookOpen, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLibrary } from '@/contexts/LibraryContext';
import { motion, AnimatePresence } from 'framer-motion';

const EnhancedSearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { books } = useLibrary();

  // Get unique areas for filters
  const areas = useMemo(() => {
    return [...new Set(books.map(book => book.area))].slice(0, 6);
  }, [books]);

  // Search suggestions based on current input
  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const bookSuggestions = books
      .filter(book => 
        book.livro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.area.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5);
    
    return bookSuggestions;
  }, [searchTerm, books]);

  const handleFilterToggle = (area: string) => {
    setSelectedFilters(prev => 
      prev.includes(area) 
        ? prev.filter(f => f !== area)
        : [...prev, area]
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    setSearchTerm('');
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Main Search Input */}
      <div className="relative">
        <div className={`
          flex items-center bg-azure-card border-2 rounded-xl transition-all duration-300
          ${isExpanded ? 'border-azure-accent shadow-lg shadow-azure-accent/20' : 'border-azure-border'}
        `}>
          <Search className="ml-4 text-azure-secondary" size={20} />
          
          <Input
            type="text"
            placeholder="Buscar livros, autores ou áreas do direito..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => setTimeout(() => setIsExpanded(false), 200)}
            className="
              flex-1 bg-transparent border-0 text-azure-text placeholder:text-azure-secondary 
              focus:ring-0 focus-visible:ring-0 px-4 py-3
            "
          />
          
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="mr-2 text-azure-secondary hover:text-azure-text"
            >
              <X size={16} />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mr-2 text-azure-secondary hover:text-azure-text"
          >
            <Filter size={16} />
          </Button>
        </div>

        {/* Search Suggestions */}
        <AnimatePresence>
          {isExpanded && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="
                absolute top-full left-0 right-0 mt-2 bg-azure-card border border-azure-border 
                rounded-xl shadow-xl z-50 overflow-hidden
              "
            >
              <div className="p-2">
                <div className="text-xs text-azure-secondary mb-2 px-3">
                  Sugestões de busca
                </div>
                {suggestions.map((book, index) => (
                  <button
                    key={book.id}
                    className="
                      w-full text-left px-3 py-2 rounded-lg hover:bg-azure-cardHover 
                      transition-colors flex items-center gap-3
                    "
                    onClick={() => {
                      setSearchTerm(book.livro);
                      setIsExpanded(false);
                      // Scroll to the book
                      setTimeout(() => {
                        const bookElement = document.querySelector(`[data-book-id="${book.id}"]`);
                        if (bookElement) {
                          bookElement.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center',
                            inline: 'nearest' 
                          });
                          // Add highlight effect
                          bookElement.classList.add('ring-2', 'ring-red-500', 'ring-offset-2', 'ring-offset-black');
                          setTimeout(() => {
                            bookElement.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2', 'ring-offset-black');
                          }, 3000);
                        }
                      }, 100);
                    }}
                  >
                    <BookOpen size={16} className="text-azure-accent" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-azure-text truncate">
                        {book.livro}
                      </div>
                      <div className="text-xs text-azure-secondary">
                        {book.area}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Filter Pills */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-3"
          >
            <div className="flex items-center gap-2 text-sm text-azure-secondary">
              <Sparkles size={16} className="text-azure-accent" />
              Filtros rápidos:
            </div>
            
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <Badge
                  key={area}
                  variant={selectedFilters.includes(area) ? 'default' : 'outline'}
                  className={`
                    cursor-pointer transition-all duration-200 hover:scale-105
                    ${selectedFilters.includes(area)
                      ? 'bg-azure-accent text-white border-azure-accent'
                      : 'border-azure-border text-azure-secondary hover:border-azure-accent hover:text-azure-accent'
                    }
                  `}
                  onClick={() => handleFilterToggle(area)}
                >
                  {area}
                </Badge>
              ))}
            </div>

            {selectedFilters.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-azure-secondary">
                  {selectedFilters.length} filtro(s) ativo(s)
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs text-azure-accent hover:text-azure-accentHover"
                >
                  Limpar tudo
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedSearchBar;