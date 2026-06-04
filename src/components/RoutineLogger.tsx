import React, { useState } from 'react';
import { Routine, RoutineStep } from '../services/api';

interface RoutineLoggerProps {
  routine: Routine;
  steps: RoutineStep[];
  onClose: () => void;
  onSave: (status: string, notes: string, photoUrl: string) => Promise<void>;
}

const RoutineLogger: React.FC<RoutineLoggerProps> = ({ routine, steps, onClose, onSave }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSaving, setIsSaveing] = useState(false);

  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const handleSave = async () => {
    setIsSaveing(true);
    try {
      const allDone = steps.every(s => completedSteps[s.id]);
      const status = allDone ? 'completed' : 'partial';
      await onSave(status, notes, photoUrl);
      onClose();
    } catch (err) {
      console.error('Failed to save log', err);
    } finally {
      setIsSaveing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-deep/20 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <header className="p-8 bg-emerald-brand text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-emerald-100 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-3xl font-serif mb-1">{routine.name}</h2>
          <p className="text-emerald-100 text-sm font-medium uppercase tracking-widest">Logging Session</p>
        </header>

        <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
          <section>
            <h3 className="text-teal-deep font-serif text-xl mb-4">Steps</h3>
            <div className="space-y-3">
              {steps.map((step) => (
                <div 
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center gap-4 ${
                    completedSteps[step.id] 
                      ? 'bg-emerald-brand/5 border-emerald-brand shadow-sm' 
                      : 'bg-off-white border-transparent hover:border-teal-soft'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    completedSteps[step.id] ? 'bg-emerald-brand border-emerald-brand text-white' : 'border-gray-300 bg-white'
                  }`}>
                    {completedSteps[step.id] && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${completedSteps[step.id] ? 'text-emerald-brand' : 'text-teal-deep'}`}>{step.product_name}</p>
                    <p className="text-xs text-gray-400">{step.instructions}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <label className="block text-teal-deep font-serif text-lg mb-2">Notes</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How does your skin feel?"
                className="w-full p-4 bg-off-white border-transparent rounded-2xl focus:ring-2 focus:ring-teal-soft focus:bg-white outline-none transition-all text-sm h-24 resize-none"
              />
            </div>
            <div>
              <label className="block text-teal-deep font-serif text-lg mb-2">Photo URL</label>
              <input 
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full p-4 bg-off-white border-transparent rounded-2xl focus:ring-2 focus:ring-teal-soft focus:bg-white outline-none transition-all text-sm"
              />
            </div>
          </section>
        </div>

        <footer className="p-8 pt-4">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full py-4 bg-emerald-brand text-white rounded-full font-bold uppercase tracking-widest shadow-lg shadow-emerald-900/20 hover:bg-emerald-900 transition-all active:scale-[0.98] ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSaving ? 'Saving...' : 'Finish Routine'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default RoutineLogger;
