import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scissors, User, Heart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

export function Navbar() {
  const [user] = useAuthState(auth);
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Style', path: '/upload' },
    { name: 'Booking', path: '/booking' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gold rounded-lg group-hover:rotate-12 transition-transform duration-300">
              <Scissors className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight">
              SMART<span className="text-gold">HAIR</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.path ? 'text-gold' : 'text-white/70 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/favorites" className="p-2 text-white/70 hover:text-gold transition-colors">
                  <Heart className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => signOut(auth)}
                  className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white"
                >
                  <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-gold" />
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className="btn-gold py-2 px-6 text-sm">
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {user && (
              <Link to="/favorites" className="p-2 text-white/70 hover:text-gold">
                <Heart className="w-5 h-5" />
              </Link>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg-card border-b border-white/10"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-white/70 hover:text-gold"
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <button onClick={handleLogin} className="w-full btn-gold mt-4">
                  Sign In
                </button>
              )}
              {user && (
                <button
                  onClick={() => {
                    signOut(auth);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-4 text-base font-medium text-white/70 hover:text-white"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-bg-card border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-gold rounded-lg">
                <Scissors className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-display font-bold">SMARTHAIR</span>
            </div>
            <p className="text-white/50 max-w-md">
              Experience the future of hairstyling with our AI-powered recommendation engine. 
              Find the perfect look tailored to your unique facial features.
            </p>
          </div>
          <div>
            <h4 className="text-gold font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-white/50">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/upload" className="hover:text-white transition-colors">Find Style</Link></li>
              <li><Link to="/booking" className="hover:text-white transition-colors">Booking</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gold font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-white/50">
              <li>support@smarthair.ai</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Salon St, AI City</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-white/30 text-sm">
          © {new Date().getFullYear()} Smart Hairstyle Finder. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
