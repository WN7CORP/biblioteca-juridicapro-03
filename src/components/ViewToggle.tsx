import React from 'react';
import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useView } from '@/contexts/ViewContext';

const ViewToggle: React.FC = () => {
  const { viewMode, setViewMode } = useView();

  return (
    <div className="flex items-center bg-azure-card border border-azure-border rounded-lg p-1">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('grid')}
        className={`
          px-3 py-2 transition-all duration-200
          ${viewMode === 'grid' 
            ? 'bg-azure-accent text-white shadow-sm' 
            : 'text-azure-secondary hover:text-azure-text hover:bg-azure-cardHover'
          }
        `}
      >
        <Grid size={16} className="mr-2" />
        Grade
      </Button>
      
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('list')}
        className={`
          px-3 py-2 transition-all duration-200
          ${viewMode === 'list' 
            ? 'bg-azure-accent text-white shadow-sm' 
            : 'text-azure-secondary hover:text-azure-text hover:bg-azure-cardHover'
          }
        `}
      >
        <List size={16} className="mr-2" />
        Lista
      </Button>
    </div>
  );
};

export default ViewToggle;