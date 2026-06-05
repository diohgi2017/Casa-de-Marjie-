import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ProductShelf from './components/ProductShelf';
import PrintableRoutine from './components/PrintableRoutine';
import RitualGallery from './components/RitualGallery';
import AIRecommendations from './components/AIRecommendations';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'shelf' | 'ritual' | 'gallery' | 'ai'>('dashboard');

  const tabs = [
    { id: 'dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011-1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg> },
    { id: 'shelf', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" /></svg> },
    { id: 'ai', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
    { id: 'gallery', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { id: 'ritual', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> }
  ] as const;

  return (
    <div className="bg-transparent min-h-screen">
      <AnimatePresence mode="wait">
        <motion.main 
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className={activeTab === 'ritual' ? '' : 'max-w-md mx-auto'}
        >
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'shelf' && <ProductShelf />}
          {activeTab === 'ritual' && <PrintableRoutine />}
          {activeTab === 'gallery' && <RitualGallery />}
          {activeTab === 'ai' && <AIRecommendations />}
        </motion.main>
      </AnimatePresence>
      
      {/* Shared Bottom Navigation */}
      <div className="fixed bottom-10 left-0 right-0 flex justify-center z-40 print:hidden pointer-events-none">
        <nav className="bg-white/80 backdrop-blur-xl border border-white/40 px-6 py-3 flex gap-4 items-center rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 pointer-events-auto">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative p-3 rounded-full transition-colors ${
                activeTab === tab.id ? 'text-emerald-brand' : 'text-gray-300 hover:text-gray-400'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="active-tab"
                  className="absolute inset-0 bg-teal-soft/30 rounded-full"
                  transition={{ type: 'spring', duration: 0.5 }}
                />
              )}
              <div className="relative z-10">
                {tab.icon}
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default App;
