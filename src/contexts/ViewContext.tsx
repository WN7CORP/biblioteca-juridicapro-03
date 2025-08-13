import React, { createContext, useContext, useState, useEffect } from 'react';

export type ViewMode = 'grid' | 'list';

interface ViewContextProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const ViewContext = createContext<ViewContextProps>({} as ViewContextProps);

export const useView = () => useContext(ViewContext);

export const ViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Load preferences from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('library_view_mode') as ViewMode;
    if (savedViewMode) setViewMode(savedViewMode);
  }, []);

  // Save preferences to localStorage
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('library_view_mode', mode);
  };

  return (
    <ViewContext.Provider
      value={{
        viewMode,
        setViewMode: handleViewModeChange,
      }}
    >
      {children}
    </ViewContext.Provider>
  );
};