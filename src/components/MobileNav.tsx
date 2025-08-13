
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Heart, Layers } from 'lucide-react';

const MobileNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    {
      icon: Home,
      label: 'Início',
      path: '/'
    },
    {
      icon: Layers,
      label: 'Categorias',
      path: '/categories'
    },
    {
      icon: BookOpen,
      label: 'Lendo',
      path: '/reading'
    },
    {
      icon: Heart,
      label: 'Favoritos',
      path: '/favorites'
    }
  ];

  return (
    <>
      {/* Bottom Navigation - Fixed Footer */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-azure-card via-azure-card to-azure-card/95 backdrop-blur-md border-t border-azure-accent/30 shadow-2xl" data-intro="navigation">
        <div className="flex justify-around items-center py-3 px-2">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center px-3 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                isActive(item.path) 
                  ? 'text-azure-accent bg-azure-accent/20 shadow-lg shadow-azure-accent/25' 
                  : 'text-azure-secondary hover:text-azure-accent hover:bg-azure-cardHover/50'
              }`}
            >
              <item.icon size={22} className="mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive(item.path) && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-azure-accent rounded-full"></div>
              )}
            </button>
          ))}
        </div>
        
        {/* Glow effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-azure-accent/50 to-transparent"></div>
      </nav>
    </>
  );
};

export default MobileNav;
