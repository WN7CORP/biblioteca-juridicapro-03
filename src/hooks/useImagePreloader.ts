import { useEffect, useCallback } from 'react';
import { imageCache } from './useImageCache';
import { Book } from '@/types';

export const useImagePreloader = (books: Book[], isVisible: boolean = true) => {
  const preloadCriticalImages = useCallback(() => {
    if (!books.length || !isVisible) return;
    
    // Get first visible books (above the fold)
    const criticalBooks = books.slice(0, 12);
    const criticalImageUrls = criticalBooks
      .map(book => book.imagem)
      .filter(url => url && url !== '/placeholder.svg' && !url.includes('placeholder'));
    
    // Preload critical images immediately
    if (criticalImageUrls.length > 0) {
      imageCache.preloadCritical(criticalImageUrls);
    }
    
    // Preload next batch with delay
    setTimeout(() => {
      const nextBooks = books.slice(12, 36);
      const nextImageUrls = nextBooks
        .map(book => book.imagem)
        .filter(url => url && url !== '/placeholder.svg' && !url.includes('placeholder'));
      
      if (nextImageUrls.length > 0) {
        imageCache.preloadBatch(nextImageUrls, 'normal');
      }
    }, 500);
  }, [books, isVisible]);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(preloadCriticalImages, 100);
    return () => clearTimeout(timer);
  }, [preloadCriticalImages]);

  return { preloadCriticalImages };
};

export const useIntersectionPreloader = () => {
  const preloadOnIntersection = useCallback((entries: IntersectionObserverEntry[], books: Book[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bookIndex = parseInt(entry.target.getAttribute('data-book-index') || '0');
        
        // Preload next 6 images when user scrolls
        const nextBooks = books.slice(bookIndex + 1, bookIndex + 7);
        const nextImageUrls = nextBooks
          .map(book => book.imagem)
          .filter(url => url && url !== '/placeholder.svg' && !url.includes('placeholder'));
        
        if (nextImageUrls.length > 0) {
          imageCache.preloadBatch(nextImageUrls, 'normal');
        }
      }
    });
  }, []);

  return { preloadOnIntersection };
};