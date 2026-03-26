import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Upload as UploadIcon, Camera, X, Sparkles, Loader2 } from 'lucide-react';
import { analyzeFace } from '../services/geminiService';
import { AnalysisResult } from '../types';

export function Upload() {
  const navigate = useNavigate();
  const [image, setImage] = React.useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeFace(image);
      // Store result in session storage to pass to results page
      sessionStorage.setItem('analysisResult', JSON.stringify(result));
      sessionStorage.setItem('userImage', image);
      navigate('/results');
    } catch (err: any) {
      const isQuota = err?.message?.includes('429') || err?.message?.includes('RESOURCE_EXHAUSTED') || err?.message?.includes('AI_BUSY') || err?.message?.includes('quota');
      if (isQuota) {
        setError("High demand. Still analyzing your features...");
      } else {
        setError("Failed to analyze image. Please try a clearer photo.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl w-full px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-premium overflow-hidden"
        >
          {(!isAnalyzing || (error && error.includes('demand'))) ? (
            <div className="p-8 md:p-12">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-display font-bold mb-4">Upload Your Photo</h1>
                <p className="text-white/50">For best results, use a well-lit, front-facing photo without glasses or hats.</p>
              </div>

              {!image ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-all duration-300 group"
                >
                  <div className="p-6 bg-white/5 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                    <UploadIcon className="w-10 h-10 text-gold" />
                  </div>
                  <p className="text-lg font-medium mb-2">Drag & drop or click to upload</p>
                  <p className="text-sm text-white/30">Supports JPG, PNG (Max 5MB)</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="relative max-w-sm mx-auto rounded-3xl overflow-hidden border-2 border-gold/30 shadow-2xl shadow-gold/10">
                    <img src={image} alt="Preview" className="w-full aspect-[3/4] object-cover" />
                    <button
                      onClick={() => setImage(null)}
                      className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => setImage(null)} className="btn-outline-gold py-3 px-8">
                      Change Photo
                    </button>
                    <button onClick={handleAnalyze} className="btn-gold py-3 px-12 flex items-center gap-2 justify-center">
                      <Sparkles className="w-5 h-5" />
                      Analyze My Face
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-20 flex flex-col items-center justify-center text-center">
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full animate-pulse" />
                <Loader2 className="w-20 h-20 text-gold animate-spin relative z-10" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-4">
                {error?.includes('demand') ? "High Demand" : "Analyzing Your Features"}
              </h2>
              <div className="space-y-4 max-w-md mx-auto">
                <p className="text-white/60 animate-pulse">
                  {error?.includes('demand') ? "Still working, please wait..." : "Detecting face shape..."}
                </p>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="bg-gold h-full"
                  />
                </div>
                <p className="text-xs text-white/30 uppercase tracking-widest">
                  {error?.includes('demand') 
                    ? "Our AI is busy but we are retrying for you automatically"
                    : "Our AI is scanning jawline, forehead, and hairline"}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
