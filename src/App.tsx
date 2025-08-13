
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LibraryProvider } from "./contexts/LibraryContext";
import { ViewProvider } from "./contexts/ViewContext";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import ReadBook from "./pages/ReadBook";
import Favorites from "./pages/Favorites";
import Reading from "./pages/Reading";
import Categories from "./pages/Categories";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();
  
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LibraryProvider>
        <ViewProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/read/:bookId" element={<ReadBook />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/reading" element={<Reading />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/:areaName" element={<Categories />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ViewProvider>
      </LibraryProvider>
    </QueryClientProvider>
  );
};

export default App;
