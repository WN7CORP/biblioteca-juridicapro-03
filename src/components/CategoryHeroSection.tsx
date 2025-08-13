import React from 'react';
import { BookOpen, Sparkles, Grid3X3 } from 'lucide-react';
import { useLibrary } from '@/contexts/LibraryContext';
const CategoryHeroSection: React.FC = () => {
  const {
    books
  } = useLibrary();
  const totalAreas = [...new Set(books.map(book => book.area))].length;
  return <div className="text-center mb-12 animate-fade-in">
      <div className="relative">
        {/* Background decoration */}
        
        
        
      </div>
    </div>;
};
export default CategoryHeroSection;