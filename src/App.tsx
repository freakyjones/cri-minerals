import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';
import MainLayout from './components/layout/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';

import { SearchProvider } from './context/SearchContext';
import CommandPalette from './components/layout/CommandPalette';

// Lazy load pages for performance (Rule 8.1)
const HomePage = lazy(() => import('./pages/HomePage'));
const MineralPage = lazy(() => import('./pages/MineralPage'));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <SearchProvider>
          <AppRoutes />
          <CommandPalette />
        </SearchProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

function AppRoutes() {
  const location = useLocation();
  
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-base flex items-center justify-center"><div className="animate-pulse bg-bg-surface h-8 w-32 rounded"></div></div>}>
      <MainLayout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/mineral/:slug" element={<MineralPage />} />
          </Routes>
        </AnimatePresence>
      </MainLayout>
    </Suspense>
  );
}

export default App;
