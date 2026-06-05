import React, { useState, useMemo } from 'react';
import { useCasaDeMarjie } from '../hooks/useCasaDeMarjie';
import { Product } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ProductShelf: React.FC = () => {
  const userId = 'test-user-1';
  const { products, loading, error, addProduct } = useCasaDeMarjie(userId);
  const [isAddModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Cleanser' | 'Treatment' | 'Serum' | 'Moisturizer'>('All');

  const filteredProducts = useMemo(() => {
    if (filter === 'All') return products;
    return products.filter(p => p.category === filter);
  }, [products, filter]);

  // Product form state
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    brand: '',
    name: '',
    category: 'Moisturizer',
    ingredients: '',
    expiry_date: ''
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProduct(newProduct as Omit<Product, 'id' | 'user_id' | 'created_at'>);
    setIsModalOpen(false);
    setNewProduct({ brand: '', name: '', category: 'Moisturizer', ingredients: '', expiry_date: '' });
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-emerald-brand font-serif">Organizing your shelf...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-soft-white pb-32">
      {/* Header */}
      <header className="p-6 pt-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl text-emerald-brand font-serif font-bold italic">The Shelf</h1>
          <p className="text-sm text-gray-500 font-sans mt-1">Your Curated Collection</p>
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

      {/* Categories Scroller */}
      <div className="px-6 mb-8 overflow-x-auto no-scrollbar py-2">
        <div className="flex gap-3 min-w-max">
          {(['All', 'Cleanser', 'Serum', 'Treatment', 'Moisturizer'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                filter === cat 
                ? 'bg-teal-deep text-white border-teal-deep shadow-md' 
                : 'bg-white text-gray-400 border-gray-100 hover:border-teal-deep/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-6 grid grid-cols-2 gap-x-4 gap-y-8">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, idx) => (
            <motion.div 
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col group"
            >
              <div className="aspect-[4/5] rounded-[2.5rem] bg-white border border-gray-50 shadow-sm overflow-hidden mb-3 relative flex items-center justify-center p-6 group-hover:shadow-md transition-shadow">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-center">
                    <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all opacity-20 group-hover:opacity-100 duration-500">
                      {product.category === 'Cleanser' ? '🧼' : product.category === 'Serum' ? '🧪' : '🧴'}
                    </span>
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                   <span className="bg-soft-white/80 backdrop-blur-sm text-teal-deep text-[7px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter border border-teal-deep/5">
                     {product.category}
                   </span>
                </div>
              </div>
              
              <div className="px-2">
                <p className="text-[9px] text-gold-accent font-serif uppercase tracking-[0.2em] mb-1">{product.brand}</p>
                <h3 className="text-xs font-bold text-teal-deep leading-tight line-clamp-2 min-h-[2rem]">{product.name}</h3>
                
                <div className="mt-3 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    className="h-full bg-emerald-brand/30"
                  ></motion.div>
                </div>
                <p className="text-[8px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Volume Left</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <footer className="p-12 text-center">
        <p className="text-[10px] text-gray-300 font-sans leading-relaxed italic max-w-[240px] mx-auto border-t border-gray-100 pt-6">
          Disclaimer: Suggestions are for informational purposes only. Casa de Marjie is not a medical professional. Consult a dermatologist for medical advice.
        </p>
      </footer>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
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
              className="relative w-full max-w-sm bg-white rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            >
              <h2 className="text-2xl text-emerald-brand font-serif font-bold mb-8 italic">New Addition</h2>
              <form onSubmit={handleAdd} className="space-y-5">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Brand</label>
                  <input 
                    type="text" 
                    placeholder="e.g. SkinCeuticals"
                    className="w-full px-5 py-4 bg-off-white rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-brand/10 font-sans"
                    value={newProduct.brand}
                    onChange={e => setNewProduct({...newProduct, brand: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Product Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Hyaluronic Acid Intensifier"
                    className="w-full px-5 py-4 bg-off-white rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-brand/10 font-sans"
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Category</label>
                  <select 
                    className="w-full px-5 py-4 bg-off-white rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-brand/10 font-sans appearance-none"
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value as any})}
                  >
                    <option>Cleanser</option>
                    <option>Serum</option>
                    <option>Treatment</option>
                    <option>Moisturizer</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-2 px-10 py-4 bg-emerald-brand text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-900/10"
                  >
                    Add to Shelf
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

export default ProductShelf;
