
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Search, X, Layers, Home, BookOpen, Heart, BookMarked } from 'lucide-react';
import { useLibrary } from '@/contexts/LibraryContext';
import { Input } from '@/components/ui/input';
import GlobalSearchBar from '@/components/GlobalSearchBar';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm, setSearchTerm } = useLibrary();
  const [showSearch, setShowSearch] = useState(false);

  const isHomePage = location.pathname === '/';
  const isReadPage = location.pathname.includes('/read/');

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleSearch = () => {
    setShowSearch(prev => !prev);
    if (showSearch) {
      setSearchTerm('');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-azure-background via-azure-background to-azure-background/95 backdrop-blur-md border-b border-azure-border/50 shadow-lg">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {isReadPage ? (
            <button
              onClick={handleGoBack}
              className="flex items-center text-azure-text hover:text-azure-accent transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="mr-2" size={20} />
              <span className="font-medium">Voltar</span>
            </button>
          ) : (
            <>
              <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-azure-accent to-azure-accent/80 bg-clip-text text-transparent flex items-center">
                <BookMarked size={28} className="mr-3 text-azure-accent drop-shadow-sm" />
                Biblioteca Jurídica
              </h1>
              
              <div className="flex items-center space-x-4">
                {!isHomePage && (
                  <div className="max-w-md">
                    <GlobalSearchBar 
                      className="max-w-md" 
                      placeholder="Buscar em toda biblioteca..."
                      showAdvanced={false}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
