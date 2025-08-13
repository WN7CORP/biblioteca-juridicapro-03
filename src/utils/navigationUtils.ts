import { NavigateFunction } from 'react-router-dom';
import { Book } from '@/types';

export interface NavigationState {
  highlightedBookId?: number;
  searchQuery?: string;
  targetArea?: string;
}

export const navigateToBookLocation = (
  book: Book, 
  navigate: NavigateFunction, 
  searchQuery?: string
) => {
  // Map areas to their respective routes
  const areaRoutes: Record<string, string> = {
    'Direito Civil': '/',
    'Direito Penal': '/',
    'Direito Constitucional': '/',
    'Direito Administrativo': '/',
    'Direito Tributário': '/',
    'Direito do Trabalho': '/',
    'Direito Processual Civil': '/',
    'Direito Empresarial': '/',
    'Direito Internacional': '/',
    'Direito Ambiental': '/'
  };

  const targetRoute = areaRoutes[book.area] || '/';
  
  const navigationState: NavigationState = {
    highlightedBookId: book.id,
    searchQuery,
    targetArea: book.area
  };

  navigate(targetRoute, { 
    state: navigationState,
    replace: false 
  });
};

export const highlightBook = (bookId: number, duration = 3000): boolean => {
  const bookElement = document.querySelector(`[data-book-id="${bookId}"]`) as HTMLElement;
  
  if (!bookElement) return false;
  
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
  
  // Remove highlight after duration
  setTimeout(() => {
    bookElement.classList.remove(
      'ring-4', 
      'ring-azure-accent', 
      'ring-offset-2', 
      'ring-offset-black'
    );
  }, duration);
  
  return true;
};

export const scrollToBook = (bookId: number): boolean => {
  const bookElement = document.querySelector(`[data-book-id="${bookId}"]`) as HTMLElement;
  
  if (!bookElement) return false;
  
  bookElement.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'center',
    inline: 'nearest' 
  });
  
  return true;
};