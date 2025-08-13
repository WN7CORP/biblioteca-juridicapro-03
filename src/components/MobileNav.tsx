
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
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-azure-border shadow-lg" data-intro="navigation">
        <div className="flex justify-around items-center pb-2">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center px-2 py-1 transition-colors ${
                isActive(item.path) 
                  ? 'text-azure-accent' 
                  : 'text-azure-secondary hover:text-azure-text'
              }`}
            >
              <item.icon size={18} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default MobileNav;
