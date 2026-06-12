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
const AnalystDashboard = lazy(() => import('./pages/AnalystDashboard'));
const SupplyChainPage = lazy(() => import('./pages/SupplyChainPage'));

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
    <MainLayout>
      <AnimatePresence mode="wait">
        <Suspense 
          key={location.pathname}
          fallback={
            <div className="min-h-screen p-8 md:p-12 max-w-7xl mx-auto w-full">
              <div className="animate-pulse bg-bg-surface h-6 w-32 rounded shadow-glass mb-8"></div>
              <div className="animate-pulse bg-bg-surface h-20 w-3/4 md:w-1/2 rounded-xl shadow-glass mb-12"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
                 <div className="space-y-8 lg:col-span-1">
                   <div className="animate-pulse bg-bg-surface h-64 rounded-xl shadow-glass"></div>
                 </div>
                 <div className="lg:col-span-2">
                   <div className="animate-pulse bg-bg-surface h-96 rounded-xl shadow-glass"></div>
                 </div>
              </div>
            </div>
          }
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyst" element={<AnalystDashboard />} />
            <Route path="/mineral/:slug" element={<MineralPage />} />
            <Route path="/supply-chain" element={<SupplyChainPage />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </MainLayout>
  );
}

export default App;
