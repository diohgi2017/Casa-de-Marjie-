import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ProductShelf from './components/ProductShelf';
import PrintableRoutine from './components/PrintableRoutine';
import GlowUpGallery from './components/GlowUpGallery';
import AIRecommendations from './components/AIRecommendations';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'shelf' | 'ritual' | 'gallery' | 'ai'>('dashboard');

  return (
    <div className="bg-soft-white min-h-screen">
      <main className={activeTab === 'ritual' ? '' : 'max-w-md mx-auto'}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'shelf' && <ProductShelf />}
        {activeTab === 'ritual' && <PrintableRoutine />}
        {activeTab === 'gallery' && <GlowUpGallery />}
        {activeTab === 'ai' && <AIRecommendations />}
      </main>
      
      {/* Shared Bottom Navigation for switching tabs */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-md border border-white/20 px-8 py-4 flex justify-around items-center rounded-3xl shadow-2xl shadow-teal-900/10 z-40 print:hidden">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={activeTab === 'dashboard' ? 'text-emerald-brand' : 'text-gray-300'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011-1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </button>
        <button 
          onClick={() => setActiveTab('shelf')}
          className={activeTab === 'shelf' ? 'text-emerald-brand' : 'text-gray-300'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          className={activeTab === 'ai' ? 'text-emerald-brand' : 'text-gray-300'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
        <button 
          onClick={() => setActiveTab('gallery')}
          className={activeTab === 'gallery' ? 'text-emerald-brand' : 'text-gray-300'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <button 
          onClick={() => setActiveTab('ritual')}
          className={activeTab === 'ritual' ? 'text-gold-accent' : 'text-gray-300'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      </nav>
    </div>
  );
};

export default App;
