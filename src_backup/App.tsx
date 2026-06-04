import { useGlowTrack } from './hooks/useGlowTrack';

function App() {
  const { products, loading, error } = useGlowTrack('test-user-1');

  return (
    <div className="min-h-screen bg-soft-white flex flex-col items-center justify-center p-8">
      <header className="mb-12 text-center">
        <h1 className="text-6xl text-emerald-brand mb-4">GlowTrack</h1>
        <p className="text-xl text-teal-deep italic">Your personal skincare command center</p>
      </header>

      <main className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-xl shadow-teal-900/5 border border-gray-100">
        <h2 className="text-3xl text-teal-deep mb-6 border-b border-teal-soft/30 pb-2">Status</h2>
        
        {loading && <p className="text-gray-500 animate-pulse">Loading your dewy glow...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        
        {!loading && !error && (
          <div className="space-y-4">
            <p className="text-gray-700">
              Welcome back! You have <span className="font-bold text-emerald-brand">{products.length}</span> products on your shelf.
            </p>
            <button 
              className="px-8 py-3 bg-emerald-brand text-white rounded-full font-semibold shadow-md hover:bg-emerald-900 transition-colors"
              onClick={() => window.location.reload()}
            >
              Refresh Routine
            </button>
          </div>
        )}
      </main>

      <footer className="mt-12 text-gray-400 text-sm font-sans uppercase tracking-widest">
        Clean • Minimal • Premium
      </footer>
    </div>
  )
}

export default App
