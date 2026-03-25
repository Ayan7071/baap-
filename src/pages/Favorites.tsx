import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Trash2, Download, Share2, Scissors } from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';

interface Favorite {
  id: string;
  hairstyleId: string;
  originalImage: string;
  styledImage: string;
  createdAt: any;
}

export function Favorites() {
  const [user] = useAuthState(auth);
  const [favorites, setFavorites] = React.useState<Favorite[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `users/${user.uid}/favorites`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Favorite[];
      setFavorites(favs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching favorites", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/favorites`, id));
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  if (!user) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex flex-col items-center justify-center text-center px-4">
        <Heart className="w-16 h-16 text-white/10 mb-6" />
        <h1 className="text-3xl font-display font-bold mb-4">Sign in to see favorites</h1>
        <p className="text-white/50 mb-8">You need to be logged in to save and view your favorite styles.</p>
        <Link to="/" className="btn-gold">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-display font-bold">My Favorites</h1>
          <span className="text-gold font-bold">{favorites.length} Styles Saved</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20 card-premium">
            <Scissors className="w-12 h-12 text-white/10 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
            <p className="text-white/50 mb-8">Start your analysis and save the styles you love!</p>
            <Link to="/upload" className="btn-gold">Find My Style</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {favorites.map((fav) => (
                <motion.div
                  key={fav.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="card-premium p-4 group"
                >
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                    <img src={fav.styledImage} alt="Styled" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      <button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = fav.styledImage;
                          link.download = `smarthair-saved.png`;
                          link.click();
                        }}
                        className="p-3 bg-white text-black rounded-full hover:bg-gold transition-colors"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(fav.id)}
                        className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gold uppercase tracking-widest text-xs">
                        {fav.hairstyleId.replace('-', ' ')}
                      </h3>
                      <p className="text-[10px] text-white/30">
                        Saved on {new Date(fav.createdAt?.seconds * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="text-white/30 hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
