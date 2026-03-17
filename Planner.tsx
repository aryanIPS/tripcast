import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Compass, 
  Loader2, 
  CheckCircle2, 
  Backpack, 
  CloudSun,
  ChevronRight,
  Sparkles,
  Plane
} from 'lucide-react';
import { getPlannerTrip, PlannerTrip } from '../services/weatherService';

export default function Planner() {
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');
  const [type, setType] = useState('Adventure');
  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState<PlannerTrip | null>(null);

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await getPlannerTrip(destination, dates, type);
      setTrip(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 space-y-20">
      <div className="max-w-3xl space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 rounded-full text-sky-600 text-xs font-black uppercase tracking-widest"
        >
          <Sparkles size={14} />
          <span>AI Intelligence</span>
        </motion.div>
        <h1 className="text-6xl font-black text-navy-900 tracking-tight leading-tight">
          Smart Itineraries <br />
          <span className="text-sky-500 underline decoration-sky-200 underline-offset-8">Weather-Optimized.</span>
        </h1>
        <p className="text-xl text-slate-400 font-medium max-w-2xl">
          Our neural engine synthesizes global climate data with your personal preferences to architect the perfect journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form Section */}
        <div className="lg:col-span-4">
          <div className="glass-card p-10 rounded-[3rem] sticky top-32">
            <form onSubmit={handlePlan} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Destination</label>
                <div className="relative group">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Swiss Alps"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-sky-500/10 transition-all font-bold text-navy-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Travel Dates</label>
                <div className="relative group">
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    placeholder="e.g. July 15-22"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-sky-500/10 transition-all font-bold text-navy-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Experience Type</label>
                <div className="grid grid-cols-1 gap-3">
                  {['Adventure', 'Relaxation', 'Family'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`px-6 py-4 rounded-2xl text-sm font-bold transition-all text-left flex items-center justify-between group ${type === t ? 'bg-sky-500 text-white shadow-xl shadow-sky-500/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                      {t}
                      <ChevronRight size={16} className={`transition-transform ${type === t ? 'translate-x-1' : 'opacity-0'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-navy-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-sm hover:bg-navy-800 transition-all shadow-2xl shadow-navy-900/20 flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Plane size={20} className="group-hover:rotate-12 transition-transform" />}
                {loading ? 'Processing...' : 'Generate Plan'}
              </button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center space-y-8 py-20"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-sky-500">
                    <Sparkles size={32} />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-navy-900">Synthesizing Data</h3>
                  <p className="text-slate-400 font-medium">Cross-referencing historical patterns and live forecasts...</p>
                </div>
              </motion.div>
            ) : trip ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                {/* Forecast Summary */}
                <div className="bg-navy-900 text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
                    <CloudSun size={150} />
                  </div>
                  <div className="relative space-y-6">
                    <div className="flex items-center gap-3 text-sky-400">
                      <CloudSun size={24} />
                      <h3 className="font-black text-xs uppercase tracking-[0.2em]">Atmospheric Outlook</h3>
                    </div>
                    <p className="text-3xl font-bold leading-tight max-w-2xl">
                      {trip.weatherForecast}
                    </p>
                  </div>
                </div>

                {/* Itinerary */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4 px-2">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-sm">
                      <Calendar size={24} />
                    </div>
                    <h2 className="text-3xl font-black text-navy-900">Curated Itinerary</h2>
                  </div>
                  <div className="space-y-6">
                    {trip.itinerary.map((day, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-10 rounded-[2.5rem] flex flex-col md:flex-row gap-10 group hover:border-emerald-100 transition-all"
                      >
                        <div className="md:w-32 shrink-0">
                          <div className="text-5xl font-black text-slate-100 group-hover:text-emerald-100 transition-colors">{i + 1}</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Sequence</div>
                        </div>
                        <div className="flex-1 space-y-6">
                          <div className="space-y-2">
                            <h4 className="text-2xl font-black text-navy-900">Phase {i + 1}</h4>
                            <p className="text-lg font-medium text-slate-600 leading-relaxed">{day.activities}</p>
                          </div>
                          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-500">
                            <CloudSun size={14} className="text-sky-400" />
                            <span>{day.weatherNote}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Packing List */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4 px-2">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-sm">
                      <Backpack size={24} />
                    </div>
                    <h2 className="text-3xl font-black text-navy-900">Essential Gear</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trip.packingList.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                          <CheckCircle2 size={20} />
                        </div>
                        <span className="font-bold text-navy-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-8 py-32 text-center">
                <div className="w-32 h-32 bg-white rounded-[3rem] shadow-xl flex items-center justify-center text-slate-100">
                  <Compass size={64} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-navy-900">Intelligence Ready</h3>
                  <p className="text-xl text-slate-400 font-medium max-w-sm mx-auto">Configure your parameters on the left to generate a weather-optimized strategy.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
