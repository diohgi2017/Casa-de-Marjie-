import React, { useState } from 'react';
import { useGlowTrack } from '../hooks/useGlowTrack';
import { Product } from '../services/api';

const categories = ['All', 'Cleanser', 'Toner', 'Serum', 'Moisturizer', 'SPF', 'Treatment'];

interface ProductUI extends Product {
  status?: 'In Use' | 'Low Stock' | 'Finished';
}

const ProductShelf: React.FC = () => {
  const userId = 'test-user-1';
  const { products, loading, error, addProduct } = useGlowTrack(userId);
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductUI | null>(null);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    brand: '',
    name: '',
    category: 'Cleanser',
    ingredients: '',
    expiry_date: '',
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProduct(newProduct);
    setIsModalOpen(false);
    setNewProduct({
      brand: '',
      name: '',
      category: 'Cleanser',
      ingredients: '',
      expiry_date: '',
    });
  };

  // Mock statuses for the UI (as they aren't in the DB yet)
  const getStatus = (id: string): 'In Use' | 'Low Stock' | 'Finished' => {
    const statuses: ('In Use' | 'Low Stock' | 'Finished')[] = ['In Use', 'Low Stock', 'Finished'];
    // Deterministic mock status based on ID
    const index = id.charCodeAt(0) % 3;
    return statuses[index];
  };

  const filteredProducts = products
    .map(p => ({ ...p, status: getStatus(p.id) }))
    .filter(p => filter === 'All' || p.category === filter);

  if (loading) return <div className="flex items-center justify-center min-h-screen text-emerald-brand font-serif">Loading your shelf...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-soft-white pb-32">
      {/* Header */}
      <header className="p-6 pt-12 flex justify-between items-center">
        <div>
          <h1 className="text-3xl text-emerald-brand font-serif font-bold">Your Shelf</h1>
          <p className="text-sm text-gray-500 font-sans">{products.length} products total</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-10 h-10 bg-emerald-brand text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </header>

      {/* Filter Chips */}
      <div className="px-6 flex gap-2 overflow-x-auto no-scrollbar pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              filter === cat 
                ? 'bg-teal-deep text-white shadow-md' 
                : 'bg-white text-gray-400 border border-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="px-6 grid grid-cols-2 gap-4">
        {filteredProducts.map((product) => (
          <div 
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-50 flex flex-col items-center text-center group active:scale-95 transition-all"
          >
            <div className="w-24 h-24 bg-off-white rounded-2xl mb-4 flex items-center justify-center text-teal-deep/20 group-hover:bg-teal-soft/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-[10px] text-gold-accent font-serif uppercase tracking-widest mb-1">{product.brand}</p>
            <h3 className="text-sm font-bold text-teal-deep leading-tight mb-2 line-clamp-1">{product.name}</h3>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
              product.status === 'In Use' ? 'bg-emerald-brand/10 text-emerald-brand' :
              product.status === 'Low Stock' ? 'bg-amber-100 text-amber-600' :
              'bg-gray-100 text-gray-400'
            }`}>
              {product.status}
            </span>
          </div>
        ))}
      </div>

      <footer className="p-12 text-center">
        <p className="text-[10px] text-gray-300 font-sans leading-relaxed italic max-w-[240px] mx-auto">
          Disclaimer: Suggestions are for informational purposes only. Casa de Marjie is not a medical professional. Consult a dermatologist for medical advice.
        </p>
      </footer>

      {/* Product Detail Overlay */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-teal-deep/40 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
          <div className="relative w-full max-w-md bg-white rounded-t-[3rem] p-8 shadow-2xl animate-slide-up">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8"></div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm text-gold-accent font-serif uppercase tracking-widest">{selectedProduct.brand}</p>
                <h2 className="text-2xl text-teal-deep font-serif font-bold">{selectedProduct.name}</h2>
              </div>
              <span className="bg-teal-soft text-teal-deep text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                {selectedProduct.category}
              </span>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Ingredients</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedProduct.ingredients || 'No ingredients listed.'}</p>
              </div>
              <div className="flex justify-between py-4 border-t border-gray-100">
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expiry Date</h4>
                  <p className="text-sm text-teal-deep font-medium">{selectedProduct.expiry_date || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</h4>
                  <p className="text-sm text-emerald-brand font-medium">{selectedProduct.status}</p>
                </div>
              </div>
              
              {selectedProduct.affiliate_url && (
                <a 
                  href={selectedProduct.affiliate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 bg-gold-accent text-white rounded-2xl font-bold uppercase tracking-widest text-xs text-center shadow-lg shadow-gold-900/10 active:scale-[0.98] transition-all"
                >
                  Buy Now
                </a>
              )}

              <button 
                onClick={() => setSelectedProduct(null)}
                className="w-full py-4 bg-emerald-brand text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-teal-deep/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
            <h2 className="text-2xl text-emerald-brand font-serif font-bold mb-6">Add Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <input 
                type="text" 
                placeholder="Brand (e.g., La Roche-Posay)"
                className="w-full px-4 py-3 bg-off-white rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-brand"
                value={newProduct.brand}
                onChange={e => setNewProduct({...newProduct, brand: e.target.value})}
                required
              />
              <input 
                type="text" 
                placeholder="Product Name (e.g., Hyalu B5 Serum)"
                className="w-full px-4 py-3 bg-off-white rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-brand"
                value={newProduct.name}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                required
              />
              <select 
                className="w-full px-4 py-3 bg-off-white rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-brand appearance-none"
                value={newProduct.category}
                onChange={e => setNewProduct({...newProduct, category: e.target.value})}
              >
                {categories.slice(1).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <textarea 
                placeholder="Ingredients (Optional)"
                className="w-full px-4 py-3 bg-off-white rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-brand h-24"
                value={newProduct.ingredients}
                onChange={e => setNewProduct({...newProduct, ingredients: e.target.value})}
              ></textarea>
              <input 
                type="date" 
                className="w-full px-4 py-3 bg-off-white rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-brand"
                value={newProduct.expiry_date}
                onChange={e => setNewProduct({...newProduct, expiry_date: e.target.value})}
              />
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
                  Add to Shelf
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default ProductShelf;
