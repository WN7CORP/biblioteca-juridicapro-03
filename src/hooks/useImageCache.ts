
import { useState, useEffect, useCallback } from 'react';

interface ImageCacheEntry {
  url: string;
  loaded: boolean;
  error: boolean;
  timestamp: number;
}

class ImageCache {
  private cache = new Map<string, ImageCacheEntry>();
  private preloadQueue = new Set<string>();
  private maxCacheSize = 200; // Increased cache size
  private maxAge = 30 * 60 * 1000; // 30 minutes - longer cache

  preload(url: string): Promise<void> {
    if (this.cache.has(url) && this.cache.get(url)!.loaded) {
      return Promise.resolve();
    }

    if (this.preloadQueue.has(url)) {
      return Promise.resolve();
    }

    this.preloadQueue.add(url);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.cache.set(url, {
          url,
          loaded: true,
          error: false,
          timestamp: Date.now()
        });
        this.preloadQueue.delete(url);
        this.cleanup();
        resolve();
      };
      img.onerror = () => {
        this.cache.set(url, {
          url,
          loaded: false,
          error: true,
          timestamp: Date.now()
        });
        this.preloadQueue.delete(url);
        reject(new Error('Failed to load image'));
      };
      img.src = url;
    });
  }

  getCacheStatus(url: string): ImageCacheEntry | null {
    const entry = this.cache.get(url);
    if (entry && Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(url);
      return null;
    }
    return entry || null;
  }

  // Batch preload for critical images
  preloadBatch(urls: string[], priority: 'high' | 'normal' = 'high'): Promise<void[]> {
    const batchSize = priority === 'high' ? 6 : 3;
    const batches: string[][] = [];
    
    // Split URLs into batches
    for (let i = 0; i < urls.length; i += batchSize) {
      batches.push(urls.slice(i, i + batchSize));
    }
    
    // Process batches sequentially to avoid overwhelming the browser
    return batches.reduce(async (previousBatch, currentBatch) => {
      await previousBatch;
      return Promise.allSettled(currentBatch.map(url => this.preload(url)));
    }, Promise.resolve([])) as Promise<void[]>;
  }

  // Preload critical images immediately
  preloadCritical(urls: string[]): void {
    const criticalUrls = urls.slice(0, 12); // First 12 images
    this.preloadBatch(criticalUrls, 'high');
  }

  private cleanup() {
    if (this.cache.size <= this.maxCacheSize) return;
    
    const entries = Array.from(this.cache.entries()).sort(
      (a, b) => a[1].timestamp - b[1].timestamp
    );
    
    const toDelete = entries.slice(0, entries.length - this.maxCacheSize);
    toDelete.forEach(([url]) => this.cache.delete(url));
  }
}

const imageCache = new ImageCache();

export const useImageCache = (url: string, priority: 'high' | 'normal' | 'low' = 'normal') => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadImage = useCallback(async () => {
    if (!url || url === '/placeholder.svg' || url.includes('placeholder')) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Check cache first - faster check
    const cached = imageCache.getCacheStatus(url);
    if (cached) {
      setIsLoaded(cached.loaded);
      setHasError(cached.error);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      await imageCache.preload(url);
      setIsLoaded(true);
      setHasError(false);
    } catch (error) {
      setIsLoaded(false);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!url) return;
    
    if (priority === 'high') {
      // High priority images load immediately
      loadImage();
    } else {
      // Stagger loading for performance
      const delay = priority === 'low' ? 200 : 50; // Reduced delays
      const timer = setTimeout(loadImage, delay);
      return () => clearTimeout(timer);
    }
  }, [loadImage, priority]);

  return { isLoaded, hasError, isLoading };
};

export { imageCache };
