import React, { useState, useMemo } from 'react';
import { useCasaDeMarjie } from '../hooks/useCasaDeMarjie';
import { Log } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const RitualGallery: React.FC = () => {
  const userId = 'test-user-1';
  const { logs, loading, error, addLog } = useCasaDeMarjie(userId);
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
    routineId: ''
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
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

  if (loading) return <div className="flex items-center justify-center min-h-screen text-emerald-brand font-serif">Curating your museum...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-soft-white pb-32">
      {/* Header */}
      <header className="p-6 pt-12 flex justify-between items-center">
        <div>
          <h1 className="text-3xl text-emerald-brand font-serif font-bold italic">Ritual Gallery</h1>
          <p className="text-sm text-gray-500 font-sans">The Museum of Your Progress</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          className="w-12 h-12 bg-emerald-brand text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-900/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </motion.button>
      </header>

      {/* Compare Toolbar */}
      <AnimatePresence>
        {photoLogs.length >= 2 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 mb-6 overflow-hidden"
          >
            <div className="bg-teal-deep/5 rounded-3xl p-4 flex items-center justify-between border border-teal-deep/5">
              <div className="text-[11px] font-medium text-teal-deep uppercase tracking-widest pl-2">
                {selectedPhoto1 && selectedPhoto2 ? (
                  <span className="text-emerald-brand font-bold">Ready to Compare</span>
                ) : (
                  <span>Select 2 photos to compare</span>
                )}
              </div>
              <button 
                disabled={!selectedPhoto1 || !selectedPhoto2}
                onClick={() => setCompareMode(true)}
                className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                  selectedPhoto1 && selectedPhoto2 
                  ? 'bg-gold-accent text-white shadow-lg shadow-gold-accent/20' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Compare
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Grid */}
      <div className="px-6 grid grid-cols-2 gap-4">
        {photoLogs.length === 0 ? (
          <div className="col-span-2 py-24 text-center">
            <div className="w-20 h-20 bg-off-white rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm font-serif italic">Your journey is just beginning.</p>
          </div>
        ) : (
          photoLogs.map((log, idx) => (
            <motion.div 
              key={log.id} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className={`relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-sm border-2 transition-all cursor-pointer ${
                selectedPhoto1 === log.photo_url || selectedPhoto2 === log.photo_url 
                ? 'border-gold-accent ring-4 ring-gold-accent/10' 
                : 'border-white'
              }`}
              onClick={() => toggleCompare(log.photo_url)}
            >
              <img src={log.photo_url} alt={log.date} className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="absolute bottom-4 right-4 text-[7px] text-white/60 font-serif italic tracking-[0.2em] pointer-events-none uppercase">
                Marjie
              </div>

              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[8px] text-teal-deep font-bold tracking-widest uppercase">
                {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>

              {selectedPhoto1 === log.photo_url || selectedPhoto2 === log.photo_url ? (
                <div className="absolute top-4 right-4 w-6 h-6 bg-gold-accent rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="absolute top-4 right-4 w-6 h-6 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Comparison Modal */}
      <AnimatePresence>
        {compareMode && selectedPhoto1 && selectedPhoto2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-teal-deep flex flex-col"
          >
            <header className="p-6 pt-12 flex justify-between items-center text-white">
              <button onClick={() => setCompareMode(false)} className="w-10 h-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-xl font-serif italic">The Evolution</h2>
              <div className="w-10"></div>
            </header>

            <div className="flex-1 relative flex items-center justify-center px-4">
              <div className="relative w-full max-w-sm aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl bg-black border-[8px] border-white/10">
                {/* Before Photo */}
                <div className="absolute inset-0">
                  <img src={selectedPhoto1} alt="Before" className="w-full h-full object-cover" />
                  <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-[10px] text-white font-bold uppercase tracking-widest border border-white/20">
                    Past
                  </div>
                </div>

                {/* After Photo Mockup */}
                <motion.div 
                  initial={{ width: '50%' }}
                  className="absolute inset-y-0 right-0 border-l-2 border-white z-20 overflow-hidden"
                  style={{ minWidth: '0%', maxWidth: '100%' }}
                >
                  <img src={selectedPhoto2} alt="After" className="absolute top-0 right-0 h-full max-w-none object-cover" style={{ width: '200%' }} />
                  <div className="absolute top-8 right-8 bg-emerald-brand px-4 py-2 rounded-full text-[10px] text-white font-bold uppercase tracking-widest shadow-lg border border-white/20">
                    Present
                  </div>
                </motion.div>
                
                {/* Comparison Visual Watermark */}
                <div className="absolute bottom-8 left-0 right-0 text-center z-30">
                  <div className="inline-block text-[10px] text-white/60 font-serif italic tracking-[0.4em] uppercase">
                    Casa de Marjie
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-12 text-center text-white/50 text-xs uppercase tracking-widest font-sans">
              Observing the transformation
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-teal-deep/80 backdrop-blur-lg" onClick={() => setIsModalOpen(false)}></div>
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-sm bg-white rounded-[3rem] p-8 shadow-2xl overflow-hidden"
            >
              <h2 className="text-2xl text-emerald-brand font-serif font-bold mb-6">Archive a Ritual</h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="w-full aspect-[4/3] bg-off-white rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 text-gray-400 overflow-hidden mb-4 group cursor-pointer hover:border-emerald-brand/30 transition-colors">
                  {newPhoto.photoUrl ? (
                    <img src={newPhoto.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-brand/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        </svg>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Upload Progression Image</span>
                    </>
                  )}
                </div>

                <input 
                  type="text" 
                  placeholder="Image URL"
                  className="w-full px-5 py-4 bg-off-white rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-brand/10 font-sans"
                  value={newPhoto.photoUrl}
                  onChange={e => setNewPhoto({...newPhoto, photoUrl: e.target.value})}
                  required
                />

                <textarea 
                  placeholder="Reflections on your skin today..."
                  className="w-full px-5 py-4 bg-off-white rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-brand/10 h-28 resize-none font-serif italic"
                  value={newPhoto.notes}
                  onChange={e => setNewPhoto({...newPhoto, notes: e.target.value})}
                ></textarea>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    className="flex-2 px-10 py-4 bg-emerald-brand text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-900/10 active:scale-[0.98]"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RitualGallery;
