import React, { useState, useEffect } from 'react';
import { useCasaDeMarjie } from '../hooks/useCasaDeMarjie';
import { Product } from '../services/api';
import { affiliateLinks } from '../data/affiliateLinks';
import { motion, AnimatePresence } from 'framer-motion';

interface RecommendedProduct extends Partial<Product> {
  id: string;
  brand: string;
  name: string;
  category: string;
  reason: string;
  price: string;
  image: string;
  type: 'Buy Again' | 'AI Recommendation';
  affiliate_url?: string;
}

const AIRecommendations: React.FC = () => {
  const userId = 'test-user-1';
  const { products, logs, loading, error } = useCasaDeMarjie(userId);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsAnalyzing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handlePurchase = (rec: RecommendedProduct) => {
    let url = rec.affiliate_url;
    if (!url) {
      const slug = rec.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const link = affiliateLinks[slug];
      url = link?.ulta || link?.amazon;
    }
    if (url) {
      window.open(url, '_blank', 'noopener noreferrer');
    }
  };

  // Mocked AI recommendations based on user data
  const recommendations: RecommendedProduct[] = [
    {
      id: 'rec-1',
      brand: 'La Roche-Posay',
      name: 'Effaclar Duo(+)',
      category: 'Treatment',
      reason: 'Based on your recent log about "skin feeling a bit dry", this hydrating treatment will help maintain your moisture barrier while targeting blemishes.',
      price: '$22.99',
      image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=400',
      type: 'AI Recommendation'
    },
    {
      id: 'rec-2',
      brand: 'CeraVe',
      name: 'Foaming Facial Cleanser',
      category: 'Cleanser',
      reason: 'Your current bottle is likely running low based on your usage frequency. Keep your routine consistent!',
      price: '$15.99',
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400',
      type: 'Buy Again'
    },
    {
      id: 'rec-3',
      brand: 'The Ordinary',
      name: 'Niacinamide 10% + Zinc 1%',
      category: 'Serum',
      reason: 'To level up your "Morning Ritual", our AI suggests adding a Vitamin C serum to protect against environmental stressors.',
      price: '$6.50',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400',
      type: 'AI Recommendation'
    }
  ];

  if (loading || isAnalyzing) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-soft-white p-12 text-center">
      <motion.div 
        animate={{ 
          rotate: 360,
          borderRadius: ["20%", "50%", "20%"] 
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-t-2 border-emerald-brand mb-8"
      ></motion.div>
      <h2 className="text-xl font-serif text-teal-deep mb-2">Consulting the Muse...</h2>
      <p className="text-xs text-gray-400 uppercase tracking-widest leading-relaxed">
        Analyzing your {logs.length} logs and {products.length} products to curate your skin's next chapter.
      </p>
    </div>
  );
  
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-soft-white pb-32">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 pt-12"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-emerald-brand/10 text-emerald-brand text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-brand/5">AI Protocol</span>
        </div>
        <h1 className="text-4xl text-emerald-brand font-serif font-bold italic">Your Protocol</h1>
        <p className="text-sm text-gray-500 font-sans mt-2">Intelligence tailored to your progression.</p>
      </motion.header>

      {/* AI Analysis Summary */}
      <section className="px-6 mb-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-teal-deep text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group"
        >
          <div className="relative z-10">
            <h3 className="text-xl font-serif mb-3 italic">Analysis Summary</h3>
            <p className="text-teal-50/80 text-sm leading-relaxed">
              Your consistency is currently in the top <span className="text-gold-accent font-bold font-sans">5%</span> of Muses this month. We've detected a significant recovery in your skin barrier hydration levels.
            </p>
            
            <div className="mt-6 flex gap-2">
              <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-gold-accent"></motion.div>
              </div>
              <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '40%' }} className="h-full bg-teal-soft/40"></motion.div>
              </div>
            </div>
          </div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-1000"></div>
        </motion.div>
      </section>

      {/* Recommendations List */}
      <section className="px-6 space-y-8">
        <h2 className="text-xl text-teal-deep font-serif font-bold px-1 italic">The Curated Edit</h2>
        
        {recommendations.map((rec, idx) => (
          <motion.div 
            key={rec.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col group transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className="relative aspect-square overflow-hidden bg-off-white">
              <img src={rec.image} alt={rec.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute top-6 left-6">
                <span className={`text-[9px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg backdrop-blur-md ${
                  rec.type === 'Buy Again' ? 'bg-white/90 text-teal-deep' : 'bg-gold-accent text-white'
                }`}>
                  {rec.type}
                </span>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] text-gold-accent font-serif uppercase tracking-[0.2em] mb-1">{rec.brand}</p>
                  <h3 className="text-xl font-bold text-teal-deep">{rec.name}</h3>
                </div>
                <span className="text-teal-deep font-bold font-sans text-lg">{rec.price}</span>
              </div>
              
              <div className="bg-soft-white p-4 rounded-2xl mb-8">
                <p className="text-xs text-gray-500 leading-relaxed italic">
                  "{rec.reason}"
                </p>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePurchase(rec)}
                className="w-full py-5 bg-emerald-brand text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-900/10 transition-all"
              >
                {rec.type === 'Buy Again' ? 'Replenish Inventory' : 'Adopt Protocol'}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </section>

      <footer className="p-12 text-center space-y-6">
        <p className="text-[9px] text-gray-400 font-sans leading-relaxed uppercase tracking-[0.2em] max-w-[260px] mx-auto">
          Casa de Marjie generates revenue through curated affiliate partnerships.
        </p>
        <p className="text-[10px] text-gray-300 font-sans leading-relaxed italic max-w-[240px] mx-auto border-t border-gray-100 pt-6">
          Disclaimer: Suggestions are for informational purposes only. Casa de Marjie is not a medical professional. Consult a dermatologist for medical advice.
        </p>
      </footer>
    </div>
  );
};

export default AIRecommendations;
