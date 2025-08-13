import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLibrary } from '@/contexts/LibraryContext';
import { Book } from '@/types';
import { searchWithScore } from '@/utils/searchUtils';

export interface SearchResult {
  book: Book;
  score: number;
  matchType: 'exact' | 'fuzzy';
}

export const useGlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState('');
  const navigate = useNavigate();
  const { books } = useLibrary();

  // Search results with scoring
  const searchResults = useMemo((): SearchResult[] => {
    if (!query.trim()) return [];
    
    const results = searchWithScore(
      books,
      query,
      (book) => `${book.livro} ${book.area} ${book.sobre}`,
      0.5 // Lower threshold for more inclusive results
    );
    
    return results.map(result => ({
      book: result.item,
      score: result.score,
      matchType: result.matchType
    }));
  }, [books, query]);

  // Navigate to book and highlight it
  const navigateToBook = useCallback(async (book: Book, searchQuery?: string) => {
    setIsSearching(true);
    
    try {
      // Determine the correct route based on current implementation
      const routes = {
        'Direito Civil': '/categories',
        'Direito Penal': '/categories', 
        'Direito Constitucional': '/categories',
        'Direito Administrativo': '/categories',
        'Direito Tributário': '/categories',
        'Direito do Trabalho': '/categories',
        'Direito Processual Civil': '/categories',
        'Direito Empresarial': '/categories',
        'Direito Internacional': '/categories',
        'Direito Ambiental': '/categories'
      };

      // Navigate to the appropriate page
      const targetRoute = routes[book.area as keyof typeof routes] || '/';
      
      // Store search state for the target page
      const searchState = {
        highlightedBookId: book.id,
        searchQuery: searchQuery || query,
        targetArea: book.area
      };

      navigate(targetRoute, { 
        state: searchState,
        replace: false 
      });

      // Wait for navigation and DOM update
      setTimeout(() => {
        scrollToAndHighlightBook(book.id);
      }, 300);

    } finally {
      setIsSearching(false);
    }
  }, [navigate, query]);

  // Scroll to and highlight book
  const scrollToAndHighlightBook = useCallback((bookId: number) => {
    const bookElement = document.querySelector(`[data-book-id="${bookId}"]`) as HTMLElement;
    
    if (bookElement) {
      // Scroll to the book
      bookElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest' 
      });
      
      // Add highlight effect
      bookElement.classList.add(
        'ring-4', 
        'ring-azure-accent', 
        'ring-offset-2', 
        'ring-offset-black',
        'transition-all',
        'duration-500'
      );
      
      // Remove highlight after 3 seconds
      setTimeout(() => {
        bookElement.classList.remove(
          'ring-4', 
          'ring-azure-accent', 
          'ring-offset-2', 
          'ring-offset-black'
        );
      }, 3000);
      
      return true;
    }
    
    return false;
  }, []);

  // Search function with AI-like responses
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setQuery(searchQuery);
    setLastSearchQuery(searchQuery);
    
    // Optional: Add analytics or tracking here
    console.log('Search performed:', searchQuery);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setLastSearchQuery('');
  }, []);

  // Get AI response based on search query
  const getAIResponse = useCallback((searchQuery: string): string => {
    const queryLower = searchQuery.toLowerCase();
    
    const responses = {
      'administrativo': 'Com base na sua pesquisa sobre Direito Administrativo, encontrei livros relevantes. Esta área abrange temas como atos administrativos, licitações, contratos públicos e responsabilidade civil do Estado.',
      'constitucional': 'Para Direito Constitucional, nossa biblioteca possui obras especializadas. Você encontrará desde fundamentos básicos até análises avançadas sobre direitos fundamentais e controle de constitucionalidade.',
      'civil': 'Em Direito Civil, temos uma coleção robusta cobrindo obrigações, contratos, responsabilidade civil, direitos reais e direito de família.',
      'penal': 'Nossa coleção de Direito Penal inclui códigos atualizados, doutrina e jurisprudência sobre crimes, penas e processo penal.',
      'tributário': 'Em Direito Tributário, você encontrará materiais sobre impostos, taxas, contribuições e o Sistema Tributário Nacional.',
      'trabalho': 'Para Direito do Trabalho, temos obras sobre relações trabalhistas, CLT, direitos e deveres do trabalhador e empregador.',
      'processual': 'Nossos livros de Direito Processual cobrem tanto o processo civil quanto penal, com foco nas últimas atualizações legislativas.',
      'empresarial': 'Em Direito Empresarial, você encontrará conteúdo sobre sociedades, contratos comerciais, falência e recuperação judicial.',
    };
    
    for (const [key, response] of Object.entries(responses)) {
      if (queryLower.includes(key)) {
        return response;
      }
    }
    
    return 'Com base na sua pesquisa, encontrei conteúdos relevantes em nossa biblioteca jurídica. Use palavras-chave específicas para resultados mais precisos.';
  }, []);

  return {
    query,
    setQuery,
    searchResults,
    isSearching,
    lastSearchQuery,
    performSearch,
    navigateToBook,
    scrollToAndHighlightBook,
    clearSearch,
    getAIResponse
  };
};