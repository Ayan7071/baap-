import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Share2, Heart, ChevronLeft, ChevronRight, Sparkles, Loader2, CheckCircle2, MapPin } from 'lucide-react';
import { AnalysisResult, Hairstyle } from '../types';
import { applyHairstyle } from '../services/geminiService';
import { cn } from '../lib/utils';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export function Results() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [result, setResult] = React.useState<AnalysisResult | null>(null);
  const [userImage, setUserImage] = React.useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = React.useState<Hairstyle | null>(null);
  const [styledImage, setStyledImage] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);

  React.useEffect(() => {
    const storedResult = sessionStorage.getItem('analysisResult');
    const storedImage = sessionStorage.getItem('userImage');
    if (storedResult && storedImage) {
      const parsedResult = JSON.parse(storedResult);
      setResult(parsedResult);
      setUserImage(storedImage);
      setSelectedStyle(parsedResult.recommendations[0]);
    } else {
      navigate('/upload');
    }
  }, [navigate]);

  const handleApplyStyle = async (style: Hairstyle) => {
    if (!userImage) return;
    setSelectedStyle(style);
    setIsGenerating(true);
    setStyledImage(null);
    setIsSaved(false);
    try {
      const styled = await applyHairstyle(userImage, style.name);
      setStyledImage(styled);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!user || !selectedStyle || !userImage || !styledImage) return;
    try {
      await addDoc(collection(db, `users/${user.uid}/favorites`), {
        userId: user.uid,
        hairstyleId: selectedStyle.id,
        originalImage: userImage,
        styledImage: styledImage,
        createdAt: serverTimestamp()
      });
      setIsSaved(true);
    } catch (err) {
      console.error("Failed to save", err);
    }
  };

  const handleDownload = () => {
    if (!styledImage) return;
    const link = document.createElement('a');
    link.href = styledImage;
    link.download = `smarthair-${selectedStyle?.id}.png`;
    link.click();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My New AI Hairstyle',
        text: `Check out this ${selectedStyle?.name} look I found on Smart Hairstyle Finder!`,
        url: window.location.href
      });
    }
  };

  const [activeCategory, setActiveCategory] = React.useState<'all' | 'trending' | 'classy' | 'long'>('all');

  const filteredRecommendations = React.useMemo(() => {
    if (!result) return [];
    if (activeCategory === 'all') return result.recommendations;
    return result.recommendations.filter(style => style.category === activeCategory);
  }, [result, activeCategory]);

  if (!result || !userImage) return null;

  const categories = [
    { id: 'all', name: 'All Styles' },
    { id: 'trending', name: 'Trending' },
    { id: 'classy', name: 'Classy' },
    { id: 'long', name: 'Long Hair' },
  ];

  return (
    <div className="pt-24 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Analysis & Recommendations */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-premium"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold">Analysis Result</h2>
                <div className="px-4 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs font-bold uppercase">
                  {result.faceShape} Shape
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {Object.entries(result.features).map(([key, value]) => (
                  <div key={key} className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">{key}</p>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Recommended Styles</h3>
              </div>

              {/* Category Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300",
                      activeCategory === cat.id 
                        ? "bg-gold text-black" 
                        : "bg-white/5 text-white/50 hover:bg-white/10"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredRecommendations.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => handleApplyStyle(style)}
                    className={cn(
                      "w-full flex items-center gap-4 p-3 rounded-2xl border transition-all duration-300 text-left group",
                      selectedStyle?.id === style.id 
                        ? "bg-gold/10 border-gold shadow-lg shadow-gold/5" 
                        : "bg-white/5 border-white/5 hover:border-white/20"
                    )}
                  >
                    <img src={style.image} alt={style.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold truncate text-sm">{style.name}</h4>
                        <span className="text-gold text-[10px] font-bold">{style.suitability}% Match</span>
                      </div>
                      <p className="text-[10px] text-white/40 line-clamp-2">{style.reason}</p>
                    </div>
                  </button>
                ))}
                {filteredRecommendations.length === 0 && (
                  <div className="py-12 text-center text-white/30">
                    No styles found in this category.
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-premium bg-gradient-to-br from-gold/5 to-transparent"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gold rounded-xl">
                  <MapPin className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-bold">Ready for the real thing?</h3>
                  <p className="text-xs text-white/50">Book an appointment at a top-rated salon near you.</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/booking')}
                className="w-full btn-gold py-3 text-sm"
              >
                Find Nearby Salons
              </button>
            </motion.div>
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="sticky top-24"
            >
              <div className="card-premium p-4 md:p-8">
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-black/40 border border-white/10 group">
                  <AnimatePresence mode="wait">
                    {isGenerating ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20"
                      >
                        <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
                        <p className="text-gold font-bold animate-pulse">Styling your hair...</p>
                      </motion.div>
                    ) : styledImage ? (
                      <motion.img
                        key="styled"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        src={styledImage}
                        alt="Styled Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <motion.img
                        key="original"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        src={userImage}
                        alt="Original"
                        className="w-full h-full object-cover opacity-50 grayscale"
                      />
                    )}
                  </AnimatePresence>

                  {!styledImage && !isGenerating && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/40">
                      <Sparkles className="w-12 h-12 text-gold/50 mb-4" />
                      <h3 className="text-xl font-bold mb-2">Select a Style</h3>
                      <p className="text-white/50 text-sm">Click on any recommended hairstyle to see the AI transformation.</p>
                      <button 
                        onClick={() => handleApplyStyle(selectedStyle!)}
                        className="btn-gold mt-6 py-2 px-8 text-sm"
                      >
                        Apply {selectedStyle?.name}
                      </button>
                    </div>
                  )}

                  {/* Floating Controls */}
                  {styledImage && !isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-6 left-6 right-6 flex justify-between items-center"
                    >
                      <div className="flex gap-2">
                        <button 
                          onClick={handleDownload}
                          className="p-3 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-gold hover:text-black transition-all"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={handleShare}
                          className="p-3 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-gold hover:text-black transition-all"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                      <button 
                        onClick={handleSave}
                        disabled={isSaved}
                        className={cn(
                          "flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all",
                          isSaved ? "bg-green-500 text-white" : "bg-gold text-black hover:bg-gold-light"
                        )}
                      >
                        {isSaved ? <CheckCircle2 className="w-5 h-5" /> : <Heart className="w-5 h-5" />}
                        {isSaved ? 'Saved' : 'Save Style'}
                      </button>
                    </motion.div>
                  )}
                </div>

                {selectedStyle && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-display font-bold">{selectedStyle.name}</h3>
                      <span className="text-gold font-bold">{selectedStyle.suitability}% Match</span>
                    </div>
                    <p className="text-white/60 leading-relaxed">{selectedStyle.description}</p>
                    <div className="mt-4 p-4 bg-gold/5 border border-gold/10 rounded-2xl">
                      <p className="text-sm italic text-gold/80">"{selectedStyle.reason}"</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
