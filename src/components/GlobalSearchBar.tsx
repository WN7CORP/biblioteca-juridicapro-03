import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Loader2, X, Send, MapPin, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLibrary } from '@/contexts/LibraryContext';
import { useToast } from '@/hooks/use-toast';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { motion, AnimatePresence } from 'framer-motion';

interface GlobalSearchBarProps {
  className?: string;
  placeholder?: string;
  showAdvanced?: boolean;
}

const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  className = '',
  placeholder = 'Buscar livros, autores ou áreas do direito...',
  showAdvanced = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [animatingBookId, setAnimatingBookId] = useState<number | null>(null);
  
  const { toggleFavorite } = useLibrary();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const {
    query,
    setQuery,
    searchResults,
    isSearching,
    performSearch,
    navigateToBook,
    clearSearch,
    getAIResponse
  } = useGlobalSearch();

  // Handle search execution
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsExpanded(true);
    setActiveTab('results');
    await performSearch(query);
  };

  // Handle favorite click with animation
  const handleFavoriteClick = async (e: React.MouseEvent, book: any) => {
    e.stopPropagation();
    
    setAnimatingBookId(book.id);
    
    // Haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50, 50]);
    }
    
    setTimeout(() => setAnimatingBookId(null), 800);
    
    try {
      await toggleFavorite(book.id);
      toast({
        title: book.favorito ? "Removido dos favoritos" : "❤️ Adicionado aos favoritos",
        description: book.livro,
        duration: 2000,
      });
    } catch (error) {
      setAnimatingBookId(null);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar favoritos",
        variant: "destructive",
      });
    }
  };

  // Handle book click and navigation
  const handleBookClick = (book: any) => {
    navigateToBook(book, query);
    setIsExpanded(false);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSearching) {
      handleSearch();
    }
    if (e.key === 'Escape') {
      setIsExpanded(false);
    }
  };

  // Handle clear
  const handleClear = () => {
    clearSearch();
    setIsExpanded(false);
    setActiveTab('search');
    inputRef.current?.focus();
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      <div 
        className={`relative w-full mx-auto transition-all duration-300 ${isExpanded ? 'z-50' : 'z-10'} ${className}`}
        ref={resultsRef}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full grid-cols-2 bg-azure-card border border-azure-border max-w-2xl mx-auto transition-all ${isExpanded ? 'lg:max-w-4xl' : ''}`}>
            <TabsTrigger 
              value="search" 
              className="data-[state=active]:bg-azure-accent data-[state=active]:text-white transition-all text-xs sm:text-sm"
            >
              <Search className="mr-1 sm:mr-2" size={14} />
              <span className="hidden sm:inline">Busca Global</span>
              <span className="sm:hidden">Buscar</span>
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              disabled={searchResults.length === 0 && !isSearching} 
              className="data-[state=active]:bg-azure-accent data-[state=active]:text-white disabled:opacity-50 transition-all text-xs sm:text-sm"
            >
              <Sparkles className="mr-1 sm:mr-2" size={14} />
              <span className="hidden sm:inline">Resultados ({searchResults.length})</span>
              <span className="sm:hidden">Resultados</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-4">
            <div className={`relative max-w-2xl mx-auto transition-all ${isExpanded ? 'lg:max-w-4xl' : ''}`}>
              <div className={`flex items-center bg-azure-card border-2 rounded-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'border-azure-accent shadow-lg shadow-azure-accent/20' : 'border-azure-border'}`}>
                <div className="flex items-center px-3 sm:px-4 py-3 sm:py-4">
                  <Search className="text-azure-accent mr-2 sm:mr-3" size={20} />
                </div>
                
                <input 
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setIsExpanded(true)}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent text-azure-text placeholder:text-azure-secondary px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base focus:outline-none min-w-0 transition-all"
                />
                
                {query && (
                  <button 
                    onClick={handleClear}
                    className="p-2 sm:p-3 text-azure-secondary hover:text-azure-text transition-all hover:scale-110"
                  >
                    <X size={18} />
                  </button>
                )}
                
                <Button 
                  onClick={handleSearch}
                  disabled={!query.trim() || isSearching}
                  className="m-2 sm:m-3 bg-azure-accent hover:bg-azure-accentHover text-white rounded-lg px-4 sm:px-6 py-2 sm:py-3 transition-all disabled:opacity-50"
                >
                  {isSearching ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                </Button>
              </div>
              
              <div className="text-center mt-3 text-azure-secondary text-xs sm:text-sm">
                Busca global inteligente - navega automaticamente para o livro
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`w-full max-w-2xl mx-auto bg-azure-card border border-azure-border rounded-xl overflow-hidden shadow-2xl transition-all ${isExpanded ? 'lg:max-w-4xl' : ''}`}
            >
              {isSearching ? (
                <div className="p-6 sm:p-8 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Sparkles className="text-azure-accent animate-pulse mr-3" size={28} />
                    <span className="text-azure-accent text-lg sm:text-xl font-medium">Buscando...</span>
                  </div>
                  <div className="text-azure-secondary text-sm sm:text-base">
                    Encontrando os melhores livros para você...
                  </div>
                </div>
              ) : (
                <>
                  {/* AI Response */}
                  {query && (
                    <div className="p-4 sm:p-6 border-b border-azure-border bg-azure-cardHover/30">
                      <div className="flex items-start mb-3">
                        <Sparkles className="text-azure-accent mt-1 mr-2 sm:mr-3 flex-shrink-0" size={18} />
                        <span className="text-azure-accent font-semibold text-sm sm:text-base">Análise da IA</span>
                      </div>
                      <p className="text-azure-text text-sm sm:text-base leading-relaxed ml-6 sm:ml-8">
                        {getAIResponse(query)}
                      </p>
                    </div>
                  )}
                  
                  {/* Search Results */}
                  {searchResults.length > 0 ? (
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-azure-text text-sm sm:text-lg font-semibold">
                          Livros encontrados ({searchResults.length})
                        </h3>
                        <span className="text-azure-secondary text-xs sm:text-sm">
                          Clique para ir até o livro
                        </span>
                      </div>
                      
                      <div className="space-y-2 max-h-80 sm:max-h-96 overflow-y-auto">
                        {searchResults.map((result, index) => {
                          const { book } = result;
                          const isAnimating = animatingBookId === book.id;
                          
                          return (
                            <motion.div
                              key={book.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleBookClick(book)}
                              className="flex items-center p-3 rounded-lg hover:bg-azure-cardHover transition-all cursor-pointer group border border-transparent hover:border-azure-accent hover:shadow-md"
                            >
                              <img 
                                src={book.imagem}
                                alt={book.livro}
                                className="w-8 h-10 sm:w-10 sm:h-14 object-cover rounded mr-3 flex-shrink-0 group-hover:scale-105 transition-all shadow-md" 
                              />
                              
                              <div className="flex-1 min-w-0 mr-3">
                                <h4 className="text-azure-text font-medium text-xs sm:text-sm line-clamp-1 group-hover:text-azure-accent transition-all">
                                  {book.livro}
                                </h4>
                                <p className="text-azure-secondary text-xs mt-1">{book.area}</p>
                                <div className="flex items-center mt-1 text-xs text-azure-accent opacity-0 group-hover:opacity-100 transition-all">
                                  <ArrowRight size={10} className="mr-1" />
                                  <span>Ir para livro</span>
                                </div>
                              </div>
                              
                              <button
                                onClick={(e) => handleFavoriteClick(e, book)}
                                className={`relative p-2 rounded-full transition-all hover:scale-110 ${
                                  book.favorito 
                                    ? 'bg-azure-accent/90 backdrop-blur-sm' 
                                    : 'bg-black/50 backdrop-blur-sm hover:bg-black/70'
                                }`}
                              >
                                <Heart 
                                  size={12}
                                  className={`transition-all duration-500 ${
                                    book.favorito 
                                      ? 'text-white fill-white' 
                                      : 'text-white hover:text-azure-accent'
                                  } ${
                                    isAnimating 
                                      ? 'animate-bounce scale-125' 
                                      : ''
                                  }`}
                                />
                                
                                {isAnimating && (
                                  <div className="absolute inset-0 rounded-full">
                                    <div className="absolute inset-0 rounded-full bg-azure-accent/40 animate-ping" />
                                    <div className="absolute inset-0 rounded-full bg-azure-accent/30 animate-ping" style={{ animationDelay: '0.1s' }} />
                                    <div className="absolute inset-0 rounded-full bg-azure-accent/20 animate-ping" style={{ animationDelay: '0.2s' }} />
                                  </div>
                                )}
                              </button>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ) : query ? (
                    <div className="p-6 text-center">
                      <Sparkles size={48} className="mx-auto text-azure-accent opacity-50 mb-4" />
                      <p className="text-azure-secondary text-lg">
                        Nenhum livro específico encontrado para "{query}"
                      </p>
                      <p className="text-azure-secondary text-sm mt-2">
                        Tente termos mais específicos como "direito civil" ou "constitucional"
                      </p>
                    </div>
                  ) : null}
                </>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default GlobalSearchBar;