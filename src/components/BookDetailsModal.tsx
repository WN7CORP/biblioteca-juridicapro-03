
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, BookOpen, Download } from 'lucide-react';
import { Book } from '@/types';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface BookDetailsModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ book, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!book) return null;

  const handleRead = () => {
    navigate(`/read/${book.id}`);
    onClose();
  };

  const handleDownload = () => {
    if (book.download) {
      window.open(book.download, '_blank');
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DialogContent className="bg-purple-900 border-purple-700 max-w-md p-0 overflow-hidden animate-dialog-entry">
        <DialogTitle className="sr-only">{book.livro}</DialogTitle>
        <DialogDescription className="sr-only">Detalhes do livro e opções</DialogDescription>
        
        <div className="relative">
          <img 
            src={book.imagem} 
            alt={book.livro} 
            className="w-full h-[200px] object-cover" 
          />
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-opacity z-10"
          >
            <X size={20} className="text-white" />
            <span className="sr-only">Fechar</span>
          </button>
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900 via-purple-900/80 to-transparent"></div>
        </div>
        
        <div className="p-5 -mt-10 relative bg-purple-900/95 backdrop-blur-sm rounded-t-lg">
          <h2 className="text-xl font-bold mb-1 drop-shadow-lg text-white">{book.livro}</h2>
          <p className="text-sm text-purple-300 mb-4">{book.area}</p>
          
          <p className="text-sm text-purple-100 mb-6">{book.sobre || "Este material jurídico aborda temas essenciais para estudantes e profissionais do direito."}</p>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleRead}
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white hover:scale-105 transition-all"
            >
              <BookOpen size={18} />
              <span>Ler</span>
            </Button>
            
            {book.download && (
              <Button 
                onClick={handleDownload}
                variant="outline"
                className="flex items-center justify-center gap-2 border-purple-500 text-purple-300 hover:bg-purple-800 hover:scale-105 transition-all"
              >
                <Download size={18} />
                <span>Download</span>
              </Button>
            )}
          </div>
        </div>
        
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes dialog-entry {
              0% { opacity: 0; transform: translate(-50%, -48%) scale(0.9); }
              100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
            
            .animate-dialog-entry {
              animation: dialog-entry 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
          `
        }} />
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailsModal;
