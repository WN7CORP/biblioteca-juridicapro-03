
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const BookCardSkeleton: React.FC = () => {
  return (
    <div className="book-card relative bg-netflix-card/50 rounded-md overflow-hidden">
      {/* Shimmer effect */}
      <div className="relative overflow-hidden">
        <div className="w-full aspect-[2/3] bg-netflix-cardHover/60 relative">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        <div className="absolute top-2 right-2">
          <div className="w-8 h-8 rounded-full bg-netflix-cardHover/60 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 bg-netflix-cardHover/60 rounded relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        <div className="h-3 w-1/2 bg-netflix-cardHover/60 rounded relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default BookCardSkeleton;
