import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Sun, Cloud, CloudRain, Snowflake, Navigation, Loader2, ArrowUpRight } from 'lucide-react';
import { getTravelPlan, WeatherData } from '../services/weatherService';

const POPULAR_CITIES = [
  'Paris', 'Tokyo', 'New York', 'Bali', 'London', 'Rome', 'Dubai', 'Sydney'
];

const WeatherIcon = ({ condition }: { condition: string }) => {
  const cond = condition.toLowerCase();
  if (cond.includes('sun') || cond.includes('clear')) return <Sun className="text-yellow-400" />;
  if (cond.includes('rain') || cond.includes('drizzle')) return <CloudRain className="text-sky-400" />;
  if (cond.includes('snow')) return <Snowflake className="text-sky-200" />;
  return <Cloud className="text-slate-400" />;
};

interface DestinationsProps {
  onSelectCity: (city: string) => void;
}

export default function Destinations({ onSelectCity }: DestinationsProps) {
  const [destinations, setDestinations] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const promises = POPULAR_CITIES.map(city => getTravelPlan(city));
        const results = await Promise.all(promises);
        setDestinations(results);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Scanning Global Horizons...</p>
      </div>
    );
  }

  return (
    <div className="py-20 space-y-20">
      <div className="max-w-3xl space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-600 text-xs font-black uppercase tracking-widest"
        >
          <Navigation size={14} />
          <span>Curated Destinations</span>
        </motion.div>
        <h1 className="text-6xl font-black text-navy-900 tracking-tight leading-tight">
          Where the weather <br />
          <span className="text-emerald-500 underline decoration-emerald-200 underline-offset-8">meets your mood.</span>
        </h1>
        <p className="text-xl text-slate-400 font-medium max-w-2xl">
          Explore our handpicked selection of global hotspots, each synchronized with real-time atmospheric intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {destinations.map((dest, i) => (
          <motion.div
            key={dest.city}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -12 }}
            onClick={() => onSelectCity(dest.city)}
            className="group cursor-pointer"
          >
            <div className="glass-card p-8 rounded-[2.5rem] h-full flex flex-col justify-between transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-emerald-500/10 group-hover:border-emerald-100">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                    <MapPin size={24} />
                  </div>
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-50">
                    <WeatherIcon condition={dest.condition} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-navy-900 tracking-tight">{dest.city}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-navy-800">{Math.round(dest.temperature)}°</span>
                    <span className="text-sm font-black text-slate-300 uppercase tracking-widest">{dest.condition}</span>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Top Activity</p>
                  <p className="text-sm font-bold text-navy-900">{dest.recommendations.outdoor[0]}</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-navy-900 group-hover:text-white group-hover:border-navy-900 transition-all">
                  <ArrowUpRight size={20} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
