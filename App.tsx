/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Cloud, 
  Sun, 
  CloudRain, 
  Snowflake, 
  Wind, 
  Droplets, 
  AlertTriangle, 
  MapPin, 
  Coffee, 
  Navigation, 
  Clock,
  ChevronRight,
  Umbrella,
  Compass,
  Loader2,
  Menu,
  X,
  User,
  LogOut,
  Plane
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebase';
import { getTravelPlan, WeatherData } from './services/weatherService';
import Destinations from './components/Destinations';
import Planner from './components/Planner';
import Tips from './components/Tips';
import SignIn from './components/SignIn';

const WeatherIcon = ({ condition, size = 24 }: { condition: string, size?: number }) => {
  const cond = condition.toLowerCase();
  if (cond.includes('sun') || cond.includes('clear')) return <Sun size={size} className="text-yellow-400" />;
  if (cond.includes('rain') || cond.includes('drizzle')) return <CloudRain size={size} className="text-sky-400" />;
  if (cond.includes('snow')) return <Snowflake size={size} className="text-sky-200" />;
  if (cond.includes('cloud')) return <Cloud size={size} className="text-slate-400" />;
  return <Sun size={size} className="text-yellow-400" />;
};

type Page = 'home' | 'destinations' | 'planner' | 'tips' | 'signin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = async (e?: React.FormEvent, searchCity?: string) => {
    if (e) e.preventDefault();
    const targetCity = searchCity || city;
    if (!targetCity.trim()) return;

    setLoading(true);
    setError(null);
    setCurrentPage('home');
    try {
      const data = await getTravelPlan(targetCity);
      setWeatherData(data);
      setCity(targetCity);
    } catch (err) {
      setError('Could not find weather data for this city. Please try another one.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDestination = (selectedCity: string) => {
    handleSearch(undefined, selectedCity);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentPage('home');
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  // Initial search for a default city
  useEffect(() => {
    const initialSearch = async () => {
      setLoading(true);
      try {
        const data = await getTravelPlan('Tokyo');
        setWeatherData(data);
        setCity('Tokyo');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initialSearch();
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'destinations', label: 'Destinations' },
    { id: 'planner', label: 'Planner' },
    { id: 'tips', label: 'Tips' },
  ];

  const renderPage = () => {
    if (authLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>;

    switch (currentPage) {
      case 'destinations':
        return <Destinations onSelectCity={handleSelectDestination} />;
      case 'planner':
        return <Planner />;
      case 'tips':
        return <Tips />;
      case 'signin':
        return <SignIn onAuthSuccess={() => setCurrentPage('home')} />;
      case 'home':
      default:
        return (
          <>
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center justify-center px-4 hero-gradient rounded-[3rem] mt-4 mx-4 overflow-hidden">
              <div className="absolute inset-0 bg-navy-900/40 backdrop-blur-[2px]" />
              
              <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium"
                >
                  <Plane size={16} className="text-sky-400" />
                  <span>The future of weather-aware travel</span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-6xl md:text-8xl font-extrabold tracking-tight text-white leading-[1.05]"
                >
                  Explore the world, <br />
                  <span className="text-emerald-500">perfectly</span> timed.
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl text-slate-200 max-w-2xl mx-auto font-medium"
                >
                  TripCast synchronizes your itinerary with real-time forecasts, ensuring every moment of your journey is captured in the best light.
                </motion.p>

                <motion.form 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onSubmit={handleSearch}
                  className="relative max-w-2xl mx-auto"
                >
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <Search size={24} />
                    </div>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Search your next destination..."
                      className="w-full pl-16 pr-36 py-6 bg-white/95 backdrop-blur-md border-none rounded-[2rem] shadow-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all text-xl font-medium text-navy-900"
                    />
                    <button 
                      type="submit"
                      disabled={loading}
                      className="absolute right-3 inset-y-3 px-8 bg-emerald-500 text-white rounded-[1.5rem] font-bold hover:bg-emerald-600 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : 'Explore'}
                    </button>
                  </div>
                </motion.form>
              </div>
            </section>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="max-w-7xl mx-auto px-4 mt-12"
                >
                  <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm">
                    <AlertTriangle size={20} />
                    <p className="font-semibold">{error}</p>
                  </div>
                </motion.div>
              )}

              {weatherData && (
                <motion.div 
                  key={weatherData.city}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="max-w-7xl mx-auto px-4 py-20 space-y-12"
                >
                  {/* Weather Alerts */}
                  {weatherData.alerts.length > 0 && (
                    <div className="space-y-4">
                      {weatherData.alerts.map((alert, i) => (
                        <motion.div 
                          key={i}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-amber-50 border-l-4 border-amber-500 text-amber-900 px-8 py-6 rounded-2xl flex items-start gap-6 shadow-sm"
                        >
                          <AlertTriangle className="shrink-0 mt-1 text-amber-600" size={28} />
                          <div>
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-1">Critical Weather Alert</h4>
                            <p className="text-lg font-medium opacity-90">{alert}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Weather Dashboard */}
                    <div className="lg:col-span-4 space-y-8">
                      <div className="glass-card p-10 rounded-[3rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-700">
                          <WeatherIcon condition={weatherData.condition} size={180} />
                        </div>
                        
                        <div className="space-y-8 relative">
                          <div className="flex items-center gap-3 text-slate-500 font-bold uppercase tracking-widest text-xs">
                            <MapPin size={16} className="text-emerald-500" />
                            <span>{weatherData.city}</span>
                          </div>
                          
                          <div className="flex items-end gap-3">
                            <span className="text-8xl font-black tracking-tighter text-navy-900">{Math.round(weatherData.temperature)}°</span>
                            <span className="text-3xl font-bold text-slate-300 mb-4">C</span>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm">
                              <WeatherIcon condition={weatherData.condition} size={32} />
                            </div>
                            <span className="text-2xl font-bold text-navy-800 capitalize">{weatherData.condition}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-100">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sky-500">
                                <Droplets size={18} />
                                <span className="text-xs font-black uppercase tracking-widest">Humidity</span>
                              </div>
                              <p className="text-2xl font-bold text-navy-900">{weatherData.humidity}%</p>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-emerald-500">
                                <Wind size={18} />
                                <span className="text-xs font-black uppercase tracking-widest">Wind</span>
                              </div>
                              <p className="text-2xl font-bold text-navy-900">{weatherData.windSpeed} <span className="text-sm font-medium text-slate-400">km/h</span></p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-navy-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                          <Clock size={200} />
                        </div>
                        <div className="relative space-y-6">
                          <div className="flex items-center gap-3 text-emerald-400">
                            <Clock size={20} />
                            <h3 className="font-black text-xs uppercase tracking-[0.2em]">Optimal Window</h3>
                          </div>
                          <p className="text-2xl font-bold leading-tight">
                            {weatherData.bestTime}
                          </p>
                          <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.3em] mb-3">Forecast Insight</p>
                            <p className="text-lg italic text-slate-200 leading-relaxed font-medium">"{weatherData.forecast}"</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Activity Suggestions */}
                    <div className="lg:col-span-8 space-y-12">
                      {/* Outdoor Activities */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-sm">
                              <Compass size={24} />
                            </div>
                            <h2 className="text-3xl font-black text-navy-900">Outdoor Adventures</h2>
                          </div>
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] bg-emerald-100/50 px-4 py-2 rounded-full">Top Picks</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {weatherData.recommendations.outdoor.map((activity, i) => (
                            <motion.div 
                              key={i}
                              whileHover={{ y: -8, scale: 1.02 }}
                              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                            >
                              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 mb-6">
                                <Navigation size={28} />
                              </div>
                              <p className="text-xl font-bold text-navy-900 leading-tight group-hover:text-emerald-600 transition-colors">{activity}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Indoor Activities */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 px-2">
                          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center shadow-sm">
                            <Umbrella size={24} />
                          </div>
                          <h2 className="text-3xl font-black text-navy-900">Indoor Exploration</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {weatherData.recommendations.indoor.map((activity, i) => (
                            <motion.div 
                              key={i}
                              whileHover={{ y: -8, scale: 1.02 }}
                              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                            >
                              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-sky-500 group-hover:text-white transition-all duration-500 mb-6">
                                <MapPin size={28} />
                              </div>
                              <p className="text-xl font-bold text-navy-900 leading-tight group-hover:text-sky-600 transition-colors">{activity}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Food & Dining */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 px-2">
                          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-sm">
                            <Coffee size={24} />
                          </div>
                          <h2 className="text-3xl font-black text-navy-900">Local Gastronomy</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {weatherData.recommendations.food.map((activity, i) => (
                            <motion.div 
                              key={i}
                              whileHover={{ y: -8, scale: 1.02 }}
                              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                            >
                              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 mb-6">
                                <Coffee size={28} />
                              </div>
                              <p className="text-xl font-bold text-navy-900 leading-tight group-hover:text-orange-600 transition-colors">{activity}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {!weatherData && !loading && !error && (
                <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-8">
                  <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center mx-auto text-slate-200">
                    <Compass size={64} className="animate-spin-slow" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl font-black text-navy-900">Where to next?</h2>
                    <p className="text-xl text-slate-400 font-medium">Enter a city above to unlock weather-optimized travel insights.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-navy-900 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentPage('home')}
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 group-hover:rotate-12 transition-all duration-500">
              <Navigation size={24} />
            </div>
            <span className="font-black text-3xl tracking-tighter text-navy-900">TripCast</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-12 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id as Page)}
                className={`hover:text-navy-900 transition-all relative py-2 ${currentPage === item.id ? 'text-navy-900' : ''}`}
              >
                {item.label}
                {currentPage === item.id && (
                  <motion.div layoutId="nav-active" className="absolute -bottom-1 left-0 right-0 h-1 bg-emerald-500 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-bold text-navy-900">{user.displayName || user.email?.split('@')[0]}</span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Premium Member</span>
                </div>
                <div className="relative group">
                  <button className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden hover:ring-4 hover:ring-emerald-500/20 transition-all">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User size={24} className="text-slate-400" />
                    )}
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-6 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setCurrentPage('signin')}
                className="hidden md:flex items-center gap-3 px-8 py-4 bg-navy-900 text-white rounded-[1.5rem] text-sm font-black uppercase tracking-widest hover:bg-navy-800 transition-all shadow-2xl shadow-navy-900/20 hover:-translate-y-1 active:scale-95"
              >
                <User size={18} />
                Sign In
              </button>
            )}
            
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-3 bg-slate-100 rounded-2xl text-navy-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden bg-white border-b border-slate-200 overflow-hidden shadow-2xl"
            >
              <div className="flex flex-col p-6 space-y-4">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id as Page);
                      setIsMenuOpen(false);
                    }}
                    className={`text-left font-black uppercase tracking-[0.2em] py-4 px-6 rounded-2xl text-sm ${currentPage === item.id ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:bg-slate-50'}`}
                  >
                    {item.label}
                  </button>
                ))}
                {!user && (
                  <button 
                    onClick={() => {
                      setCurrentPage('signin');
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-5 bg-navy-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm"
                  >
                    Sign In
                  </button>
                )}
                {user && (
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-5 bg-red-50 text-red-600 rounded-2xl font-black uppercase tracking-[0.2em] text-sm"
                  >
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-slate-200 py-24 px-6 mt-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Navigation size={20} />
              </div>
              <span className="font-black text-2xl tracking-tighter text-navy-900">TripCast</span>
            </div>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              Synchronizing global exploration with the perfect climate. Your journey, optimized by intelligence.
            </p>
          </div>
          
          <div className="space-y-8">
            <h4 className="font-black uppercase tracking-[0.3em] text-[10px] text-navy-900">Platform</h4>
            <ul className="space-y-5 text-sm font-bold text-slate-400">
              <li><button onClick={() => setCurrentPage('destinations')} className="hover:text-emerald-500 transition-colors">Destinations</button></li>
              <li><button onClick={() => setCurrentPage('planner')} className="hover:text-emerald-500 transition-colors">Trip Planner</button></li>
              <li><button onClick={() => setCurrentPage('tips')} className="hover:text-emerald-500 transition-colors">Travel Tips</button></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="font-black uppercase tracking-[0.3em] text-[10px] text-navy-900">Company</h4>
            <ul className="space-y-5 text-sm font-bold text-slate-400">
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Our Vision</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Intelligence</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Partners</a></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="font-black uppercase tracking-[0.3em] text-[10px] text-navy-900">Newsletter</h4>
            <p className="text-sm text-slate-400 font-medium">Join 50,000+ travelers receiving weather-optimized insights.</p>
            <div className="flex gap-3">
              <input type="email" placeholder="Email" className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm w-full focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold" />
              <button className="bg-emerald-500 text-white p-4 rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">© 2026 TripCast Intelligence. All rights reserved.</p>
          <div className="flex gap-12 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
            <a href="#" className="hover:text-navy-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-navy-900 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
