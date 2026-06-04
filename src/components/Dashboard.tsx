import React, { useState, useEffect } from 'react';
import { useGlowTrack } from '../hooks/useGlowTrack';
import type { Routine, RoutineStep } from '../services/api';
import RoutineLogger from './RoutineLogger';

const Dashboard: React.FC = () => {
  const userId = 'test-user-1'; 
  const { routines, logs, loading, error, addLog, getRoutineWithSteps, calculateStreak } = useGlowTrack(userId);
  const [selectedRoutineSteps, setSelectedRoutineSteps] = useState<Record<string, RoutineStep[]>>({});
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);

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
  }, [routines, getRoutineWithSteps]);

  const streak = calculateStreak(); 

  if (loading) return <div className="flex items-center justify-center min-h-screen text-emerald-brand font-serif">Loading your glow...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-soft-white pb-24">
      {/* Header */}
      <header className="p-6 pt-12 flex justify-between items-start">
        <div>
          <h1 className="text-4xl text-emerald-brand font-serif">Good morning,</h1>
          <p className="text-2xl text-teal-deep font-serif">Glow Getter ✨</p>
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-emerald-brand/20 p-1">
          <div className="w-full h-full rounded-full bg-teal-soft flex items-center justify-center text-emerald-brand font-bold">
            G
          </div>
        </div>
      </header>

      {/* Streak Card */}
      <section className="px-6 mb-8">
        <div className="bg-emerald-brand rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider mb-1">Current Streak</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-serif">{streak}</span>
              <span className="text-xl text-emerald-100">days</span>
            </div>
            <p className="mt-4 text-sm text-emerald-50/80">You're glowing! Keep up the consistency for best results.</p>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </section>

      {/* Routines */}
      <section className="px-6 space-y-8">
        {routines.map((routine) => {
          const steps = selectedRoutineSteps[routine.id] || [];
          const isCompleted = logs.some(l => l.routine_id === routine.id && l.date === new Date().toISOString().split('T')[0]);

          return (
            <div key={routine.id}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-teal-deep font-serif">{routine.name}</h2>
                <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${
                  isCompleted ? 'text-emerald-brand bg-emerald-brand/10' : 'text-gray-400 bg-gray-100'
                }`}>
                  {isCompleted ? 'Completed Today' : `${steps.length} steps`}
                </span>
              </div>
              <div className={`space-y-3 ${isCompleted ? 'opacity-60' : ''}`}>
                {steps.map((step) => (
                  <div 
                    key={step.id} 
                    className="p-4 rounded-2xl border bg-white border-gray-100 shadow-md flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isCompleted ? 'bg-emerald-brand border-emerald-brand text-white' : 'border-gray-200'
                      }`}>
                        {isCompleted && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className={`font-medium ${isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>{step.product_name}</p>
                        <p className="text-xs text-gray-400">{step.instructions || step.brand}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {!isCompleted && steps.length > 0 && (
                  <button 
                    onClick={() => setActiveRoutine(routine)}
                    className="w-full py-4 bg-teal-soft text-teal-deep rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-teal-200 transition-all shadow-sm active:scale-[0.98]"
                  >
                    Start Session
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Routine Logger Modal */}
      {activeRoutine && (
        <RoutineLogger 
          routine={activeRoutine}
          steps={selectedRoutineSteps[activeRoutine.id] || []}
          onClose={() => setActiveRoutine(null)}
          onSave={(status, notes, photoUrl) => addLog(activeRoutine.id, status, notes, photoUrl)}
        />
      )}

      {/* Bottom Nav Mockup */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-md border border-white/20 px-8 py-4 flex justify-around items-center rounded-3xl shadow-2xl shadow-teal-900/10">
        <button className="text-emerald-brand">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011-1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </button>
        <button className="text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </button>
        <button className="text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>
        <button className="text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
