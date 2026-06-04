import React, { useState, useMemo } from 'react';
import { useGlowTrack } from '../hooks/useGlowTrack';
import { Log } from '../services/api';

const GlowUpGallery: React.FC = () => {
  const userId = 'test-user-1';
  const { logs, loading, error, addLog } = useGlowTrack(userId);
  const [isUploadModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto1, setSelectedPhoto1] = useState<string | null>(null);
  const [selectedPhoto2, setSelectedPhoto2] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);

  // Filter logs that have photos
  const photoLogs = useMemo(() => {
    return logs.filter(log => log.photo_url && log.photo_url.trim() !== '').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [logs]);

  // Upload form state
  const [newPhoto, setNewPhoto] = useState({
    photoUrl: '',
    notes: '',
    routineId: '' // We might need to pick a routine to link the log to
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    // Default to the first routine if none selected
    const routineId = newPhoto.routineId || (logs[0]?.routine_id) || 'default-routine';
    await addLog(routineId, 'completed', newPhoto.notes, newPhoto.photoUrl);
    setIsModalOpen(false);
    setNewPhoto({ photoUrl: '', notes: '', routineId: '' });
  };

  const toggleCompare = (url: string) => {
    if (selectedPhoto1 === url) {
      setSelectedPhoto1(null);
    } else if (selectedPhoto2 === url) {
      setSelectedPhoto2(null);
    } else if (!selectedPhoto1) {
      setSelectedPhoto1(url);
    } else if (!selectedPhoto2) {
      setSelectedPhoto2(url);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-emerald-brand font-serif">Loading your progress...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-soft-white pb-32">
      {/* Header */}
      <header className="p-6 pt-12 flex justify-between items-center">
        <div>
          <h1 className="text-3xl text-emerald-brand font-serif font-bold">Glow Up Gallery</h1>
          <p className="text-sm text-gray-500 font-sans">Visualize your progress</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-10 h-10 bg-emerald-brand text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </header>

      {/* Compare Toolbar */}
      {photoLogs.length >= 2 && (
        <div className="px-6 mb-6">
          <div className="bg-teal-deep/5 rounded-2xl p-4 flex items-center justify-between">
            <div className="text-xs font-medium text-teal-deep">
              {selectedPhoto1 && selectedPhoto2 ? (
                <span>Ready to compare!</span>
              ) : (
                <span>Select 2 photos to compare</span>
              )}
            </div>
            <button 
              disabled={!selectedPhoto1 || !selectedPhoto2}
              onClick={() => setCompareMode(true)}
              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                selectedPhoto1 && selectedPhoto2 
                ? 'bg-gold-accent text-white shadow-md' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Compare
            </button>
          </div>
        </div>
      )}

      {/* Photo Grid */}
      <div className="px-6 grid grid-cols-2 gap-4">
        {photoLogs.length === 0 ? (
          <div className="col-span-2 py-20 text-center">
            <div className="w-20 h-20 bg-off-white rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">No photos yet. Start your journey!</p>
          </div>
        ) : (
          photoLogs.map((log) => (
            <div 
              key={log.id} 
              className={`relative aspect-[3/4] rounded-3xl overflow-hidden shadow-sm border-2 transition-all cursor-pointer ${
                selectedPhoto1 === log.photo_url || selectedPhoto2 === log.photo_url 
                ? 'border-gold-accent scale-[0.98]' 
                : 'border-transparent'
              }`}
              onClick={() => toggleCompare(log.photo_url)}
            >
              <img src={log.photo_url} alt={log.date} className="w-full h-full object-cover" />
              
              {/* Branded Watermark */}
              <div className="absolute bottom-3 right-3 text-[8px] text-white/40 font-serif italic tracking-widest pointer-events-none">
                Casa de Marjie
              </div>

              {/* Date Badge */}
              <div className="absolute top-3 left-3 bg-black/20 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] text-white font-bold">
                {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>

              {/* Selection Indicator */}
              {(selectedPhoto1 === log.photo_url || selectedPhoto2 === log.photo_url) && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-gold-accent rounded-full flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Comparison Modal */}
      {compareMode && selectedPhoto1 && selectedPhoto2 && (
        <div className="fixed inset-0 z-50 bg-teal-deep flex flex-col">
          <header className="p-6 pt-12 flex justify-between items-center text-white">
            <button onClick={() => setCompareMode(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-serif">Comparison</h2>
            <div className="w-6"></div>
          </header>

          <div className="flex-1 relative flex items-center justify-center px-4">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl bg-black">
              {/* Before Photo */}
              <div className="absolute inset-0">
                <img src={selectedPhoto1} alt="Before" className="w-full h-full object-cover" />
                <div className="absolute bottom-6 left-6 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white font-bold uppercase tracking-widest">
                  Before
                </div>
              </div>

              {/* Slider / After Photo Mockup - Just showing side by side or layered for simplicity in this mockup */}
              <div className="absolute inset-y-0 right-0 w-1/2 border-l border-white/50 overflow-hidden">
                <img src={selectedPhoto2} alt="After" className="absolute top-0 right-0 h-full max-w-none object-cover" style={{ width: '200%' }} />
                <div className="absolute bottom-6 right-6 bg-emerald-brand px-3 py-1.5 rounded-full text-xs text-white font-bold uppercase tracking-widest shadow-lg">
                  After
                </div>
              </div>
              
              {/* Slider Handle Mockup */}
              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white z-10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7l-4 4m0 0l4 4m-4-4h16m-4-7l4 4m0 0l-4 4" />
                  </svg>
                </div>
              </div>

              <div className="absolute bottom-4 left-0 right-0 text-center">
                <div className="inline-block text-[10px] text-white/60 font-serif italic tracking-widest uppercase">
                  Casa de Marjie
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-12 text-center text-white/60 text-sm italic font-serif">
            Slide to reveal the glow
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-teal-deep/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
            <h2 className="text-2xl text-emerald-brand font-serif font-bold mb-6">Log Your Glow</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="w-full aspect-square bg-off-white rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 text-gray-400 overflow-hidden mb-4">
                {newPhoto.photoUrl ? (
                  <img src={newPhoto.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Tap to Add Photo URL</span>
                  </>
                )}
              </div>

              <input 
                type="text" 
                placeholder="Photo URL (for mockup)"
                className="w-full px-4 py-3 bg-off-white rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-brand"
                value={newPhoto.photoUrl}
                onChange={e => setNewPhoto({...newPhoto, photoUrl: e.target.value})}
                required
              />

              <textarea 
                placeholder="How does your skin feel?"
                className="w-full px-4 py-3 bg-off-white rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-brand h-24"
                value={newPhoto.notes}
                onChange={e => setNewPhoto({...newPhoto, notes: e.target.value})}
              ></textarea>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-gray-400 font-bold uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-2 px-8 py-3 bg-emerald-brand text-white rounded-xl font-bold uppercase tracking-widest text-[10px]"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlowUpGallery;
