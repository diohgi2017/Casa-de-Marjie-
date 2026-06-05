import React, { useState, useEffect } from 'react';
import { useCasaDeMarjie } from '../hooks/useCasaDeMarjie';
import { Routine, RoutineStep } from '../services/api';

const PrintableRoutine: React.FC = () => {
  const userId = 'test-user-1';
  const { routines, loading, error, getRoutineWithSteps } = useCasaDeMarjie(userId);
  const [selectedRoutineSteps, setSelectedRoutineSteps] = useState<Record<string, RoutineStep[]>>({});

  useEffect(() => {
    const fetchSteps = async () => {
      const stepsMap: Record<string, RoutineStep[]> = {};
      for (const routine of routines) {
        const steps = await getRoutineWithSteps(routine.id);
        stepsMap[routine.id] = steps;
      }
      setSelectedRoutineSteps(stepsMap);
    };

    if (routines.length > 0) {
      fetchSteps();
    }
  }, [routines]);

  if (loading) return <div className="p-8 text-center font-serif text-emerald-brand">Preparing your menu...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-white p-12 max-w-4xl mx-auto print:p-0">
      {/* Decorative Border */}
      <div className="border-[1px] border-emerald-brand/20 p-12 relative h-full min-h-[1000px]">
        {/* Logo/Header */}
        <header className="text-center mb-16">
          <div className="text-emerald-brand text-sm tracking-[0.4em] uppercase mb-4 font-sans font-light">
            Casa de Marjie
          </div>
          <h1 className="text-5xl text-teal-deep font-serif italic mb-2">Ritual Menu</h1>
          <div className="w-12 h-[1px] bg-gold-accent mx-auto mb-4"></div>
          <p className="text-gray-400 font-sans text-xs uppercase tracking-widest">Personalized Skincare Menu</p>
        </header>

        {/* Routines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {routines.map((routine) => (
            <div key={routine.id} className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl text-teal-deep font-serif mb-1">{routine.name}</h2>
                <div className="text-[10px] text-gold-accent uppercase tracking-[0.2em]">{routine.time_of_day} Ritual</div>
              </div>

              <div className="space-y-6">
                {(selectedRoutineSteps[routine.id] || []).map((step, index) => (
                  <div key={step.id} className="flex gap-6 items-start">
                    <span className="text-gold-accent font-serif italic text-lg opacity-50">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 border-b border-gray-100 pb-4">
                      <h3 className="text-sm font-bold text-teal-deep uppercase tracking-wider mb-1">
                        {step.product_name}
                      </h3>
                      <p className="text-[11px] text-gray-500 font-serif italic">
                        {step.instructions || step.brand}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="absolute bottom-12 left-12 right-12 text-center">
          <div className="w-full h-[1px] bg-emerald-brand/10 mb-8"></div>
          <p className="text-[10px] text-gray-400 font-serif italic max-w-xs mx-auto">
            "Beauty begins the moment you decide to be yourself."
          </p>
          <p className="mt-4 text-[8px] text-gray-300 uppercase tracking-widest">Casa de Marjie Premium Experience</p>
        </footer>

        {/* Corner Accents */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-gold-accent/30"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-gold-accent/30"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-gold-accent/30"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-gold-accent/30"></div>
      </div>

      {/* Print Button (Hidden during print) */}
      <div className="fixed bottom-8 right-8 print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-emerald-brand text-white px-8 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform font-bold uppercase tracking-widest text-xs flex items-center gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Your Ritual
        </button>
      </div>
    </div>
  );
};

export default PrintableRoutine;
