import React from 'react';
import { motion } from 'motion/react';
import { 
  CloudRain, 
  Sun, 
  Snowflake, 
  Wind, 
  Thermometer, 
  Umbrella, 
  Coffee, 
  Camera, 
  Backpack,
  ShieldCheck,
  Lightbulb,
  Info
} from 'lucide-react';

const TIP_CATEGORIES = [
  {
    title: 'Rainy Expeditions',
    icon: <CloudRain className="text-sky-400" />,
    color: 'sky',
    tips: [
      { icon: <Umbrella size={18} />, text: 'Invest in a high-quality, windproof travel umbrella.' },
      { icon: <Coffee size={18} />, text: 'Curate a list of cozy indoor cafes and local museums.' },
      { icon: <Camera size={18} />, text: 'Use waterproof gear bags for your electronics and optics.' }
    ]
  },
  {
    title: 'High-Heat Survival',
    icon: <Sun className="text-orange-400" />,
    color: 'orange',
    tips: [
      { icon: <Thermometer size={18} />, text: 'Schedule outdoor activities for early morning or late evening.' },
      { icon: <Backpack size={18} />, text: 'Carry a reusable insulated water bottle to stay hydrated.' },
      { icon: <ShieldCheck size={18} />, text: 'Apply high-SPF sunscreen every two hours of exposure.' }
    ]
  },
  {
    title: 'Winter Navigation',
    icon: <Snowflake className="text-blue-300" />,
    color: 'blue',
    tips: [
      { icon: <Backpack size={18} />, text: 'Master the art of layering: Base, Mid, and Outer shells.' },
      { icon: <ShieldCheck size={18} />, text: 'Check local transit alerts frequently for weather delays.' },
      { icon: <Lightbulb size={18} />, text: 'Keep your phone in an inner pocket to preserve battery life.' }
    ]
  }
];

export default function Tips() {
  return (
    <div className="py-20 space-y-20">
      <div className="max-w-3xl space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full text-amber-600 text-xs font-black uppercase tracking-widest"
        >
          <Lightbulb size={14} />
          <span>Expert Insights</span>
        </motion.div>
        <h1 className="text-6xl font-black text-navy-900 tracking-tight leading-tight">
          Travel Smarter <br />
          <span className="text-amber-500 underline decoration-amber-200 underline-offset-8">In Any Climate.</span>
        </h1>
        <p className="text-xl text-slate-400 font-medium max-w-2xl">
          Our field-tested strategies ensure your journey remains seamless, regardless of what the atmosphere throws your way.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {TIP_CATEGORIES.map((category, i) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group"
          >
            <div className="glass-card p-10 rounded-[3rem] h-full space-y-10 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50">
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-[1.5rem] bg-${category.color}-50 flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                  {category.icon}
                </div>
                <h3 className="text-2xl font-black text-navy-900 tracking-tight">{category.title}</h3>
              </div>

              <div className="space-y-6">
                {category.tips.map((tip, j) => (
                  <div key={j} className="flex gap-5 group/tip">
                    <div className={`mt-1 w-10 h-10 shrink-0 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover/tip:bg-navy-900 group-hover/tip:text-white transition-all`}>
                      {tip.icon}
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed pt-1">
                      {tip.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* General Advice Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-navy-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-20 opacity-5 group-hover:scale-110 transition-transform duration-700">
          <Wind size={300} />
        </div>
        <div className="relative max-w-3xl space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20">
              <Info size={24} />
            </div>
            <h2 className="text-3xl font-black tracking-tight">The Golden Rule</h2>
          </div>
          <p className="text-2xl md:text-3xl font-bold leading-tight text-slate-300">
            "There is no such thing as bad weather, only <span className="text-white italic">inappropriate clothing</span>. Always check the 24-hour forecast before departing your base."
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            {['Check Forecasts', 'Pack Layers', 'Stay Flexible', 'Local Intel'].map((tag) => (
              <span key={tag} className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
