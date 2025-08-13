
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
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

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
      <div className="container mx-auto px-6 py-5 flex flex-col">
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
        
        {!isReadPage && (
          <div className="flex justify-center mt-4">
            <nav className="hidden md:flex items-center space-x-2 bg-azure-card/30 backdrop-blur-sm rounded-full px-6 py-2 border border-azure-border/20">
              <NavLink to="/" icon={Home} label="Início" isActive={isActive('/')} />
              <NavLink to="/categories" icon={Layers} label="Categorias" isActive={isActive('/categories')} />
              <NavLink to="/reading" icon={BookOpen} label="Lendo" isActive={isActive('/reading')} />
              <NavLink to="/favorites" icon={Heart} label="Favoritos" isActive={isActive('/favorites')} />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Helper component for navigation links
const NavLink = ({ to, icon: Icon, label, isActive }: { to: string; icon: any; label: string; isActive: boolean }) => (
  <Link 
    to={to} 
    className={`group relative p-3 rounded-full transition-all duration-300 hover:scale-110 ${
      isActive 
        ? 'text-azure-accent bg-azure-accent/10' 
        : 'text-azure-secondary hover:text-azure-accent hover:bg-azure-card/50'
    }`}
    title={label}
  >
    <Icon size={20} />
    {isActive && (
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-azure-accent rounded-full"></div>
    )}
  </Link>
);

export default Header;
