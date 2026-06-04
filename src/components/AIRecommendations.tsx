import React from 'react';
import { useGlowTrack } from '../hooks/useGlowTrack';
import { Product } from '../services/api';
import { affiliateLinks } from '../data/affiliateLinks';

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
  const { products, logs, loading, error } = useGlowTrack(userId);

  const handlePurchase = (rec: RecommendedProduct) => {
    // Try the product's affiliate_url first, then fall back to name-based lookup
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
      reason: 'To level up your "Morning Glow", our AI suggests adding a Vitamin C serum to protect against environmental stressors.',
      price: '$6.50',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400',
      type: 'AI Recommendation'
    }
  ];

  if (loading) return <div className="flex items-center justify-center min-h-screen text-emerald-brand font-serif">Consulting our AI dermatologists...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-soft-white pb-32">
      {/* Header */}
      <header className="p-6 pt-12">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-emerald-brand/10 text-emerald-brand text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Premium Feature</span>
        </div>
        <h1 className="text-3xl text-emerald-brand font-serif font-bold italic">Your AI Skin Plan</h1>
        <p className="text-sm text-gray-500 font-sans mt-2">Personalized recommendations powered by your progress.</p>
      </header>

      {/* AI Analysis Summary */}
      <section className="px-6 mb-8">
        <div className="bg-teal-deep text-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-serif mb-2">Analysis Summary</h3>
            <p className="text-teal-50/80 text-sm leading-relaxed">
              We've analyzed your {logs.length} logs and {products.length} products. Your consistency is in the top <span className="text-gold-accent font-bold font-sans">5%</span> this month. Your skin barrier appears to be recovering well.
            </p>
          </div>
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        </div>
      </section>

      {/* Recommendations List */}
      <section className="px-6 space-y-6">
        <h2 className="text-xl text-teal-deep font-serif font-bold px-1">Curated for you</h2>
        
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-50 flex flex-col group transition-all hover:shadow-md">
            <div className="relative aspect-video overflow-hidden bg-off-white">
              <img src={rec.image} alt={rec.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4">
                <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm ${
                  rec.type === 'Buy Again' ? 'bg-white/90 text-teal-deep' : 'bg-gold-accent text-white'
                }`}>
                  {rec.type}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[10px] text-gold-accent font-serif uppercase tracking-widest">{rec.brand}</p>
                  <h3 className="text-lg font-bold text-teal-deep">{rec.name}</h3>
                </div>
                <span className="text-teal-deep font-bold font-sans">{rec.price}</span>
              </div>
              
              <p className="text-xs text-gray-500 leading-relaxed mb-6 italic">
                "{rec.reason}"
              </p>
              
              <button 
                onClick={() => handlePurchase(rec)}
                className="w-full py-4 bg-emerald-brand text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-900/10 active:scale-[0.98] transition-all"
              >
                {rec.type === 'Buy Again' ? 'Reorder Now' : 'Purchase via Affiliate'}
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Affiliate Disclosure */}
      <footer className="p-12 text-center">
        <p className="text-[10px] text-gray-400 font-sans leading-relaxed uppercase tracking-tighter max-w-[200px] mx-auto">
          Casa de Marjie may earn a commission from purchases made through these links.
        </p>
      </footer>
    </div>
  );
};

export default AIRecommendations;
