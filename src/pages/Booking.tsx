import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Star, Calendar, Clock, Scissors } from 'lucide-react';
import { cn } from '../lib/utils';

const SALONS = [
  {
    id: 1,
    name: "Golden Scissors Luxury",
    address: "123 Style Ave, Fashion District",
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    price: "$$$"
  },
  {
    id: 2,
    name: "Modern Edge Barbershop",
    address: "456 Trend Blvd, Downtown",
    rating: 4.7,
    reviews: 256,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop",
    price: "$$"
  },
  {
    id: 3,
    name: "The Royal Grooming Co.",
    address: "789 Heritage Rd, West Side",
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1512690196162-7c97262c4145?w=400&h=300&fit=crop",
    price: "$$$"
  }
];

export function Booking() {
  const [selectedSalon, setSelectedSalon] = React.useState<typeof SALONS[0] | null>(null);
  const [isBooked, setIsBooked] = React.useState(false);

  const handleBook = () => {
    setIsBooked(true);
    setTimeout(() => setIsBooked(false), 3000);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold mb-4">Book Your Transformation</h1>
          <p className="text-white/50">Connect with top-rated local salons to bring your AI style to life.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {SALONS.map((salon, i) => (
            <motion.div
              key={salon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-premium group cursor-pointer"
              onClick={() => setSelectedSalon(salon)}
            >
              <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                <img src={salon.image} alt={salon.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-gold text-xs font-bold">
                  {salon.price}
                </div>
              </div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold group-hover:text-gold transition-colors">{salon.name}</h3>
                <div className="flex items-center gap-1 text-gold">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold">{salon.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white/40 text-sm mb-6">
                <MapPin className="w-4 h-4" />
                <span>{salon.address}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSalon(salon);
                }}
                className="w-full btn-outline-gold py-2 text-sm"
              >
                View Details
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedSalon && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-premium max-w-lg w-full p-8 relative"
          >
            <button 
              onClick={() => setSelectedSalon(null)}
              className="absolute top-6 right-6 text-white/50 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gold rounded-xl">
                <Scissors className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">{selectedSalon.name}</h2>
                <p className="text-white/50 text-sm">{selectedSalon.address}</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-gold mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Date</span>
                  </div>
                  <p className="font-medium">Tomorrow, Oct 24</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-gold mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Time</span>
                  </div>
                  <p className="font-medium">10:30 AM</p>
                </div>
              </div>

              <div className="p-4 bg-gold/5 border border-gold/10 rounded-2xl">
                <h4 className="text-sm font-bold mb-2">Selected Service</h4>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">AI-Recommended Cut & Style</span>
                  <span className="text-gold font-bold">$65.00</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleBook}
              disabled={isBooked}
              className={cn(
                "w-full py-4 rounded-full font-bold transition-all",
                isBooked ? "bg-green-500 text-white" : "bg-gold text-black hover:bg-gold-light"
              )}
            >
              {isBooked ? 'Booking Confirmed!' : 'Confirm Booking'}
            </button>
            <p className="text-center text-[10px] text-white/30 mt-4 uppercase tracking-widest">
              No payment required until your visit
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
