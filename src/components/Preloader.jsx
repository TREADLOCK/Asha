import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShinyText from './ShinyText';
import { Heart } from 'lucide-react';

const RisingHeart = ({ delay, x, initialY, size, duration }) => (
  <motion.div
    initial={{ y: initialY, x: `${x}vw`, opacity: 0, scale: 0 }}
    animate={{ 
      y: '-10vh', 
      opacity: [0, 0.4, 0.4, 0],
      scale: [0, size, size, 0],
      rotate: [0, 45, -45, 0]
    }}
    transition={{ 
      duration: duration, 
      delay: delay, 
      repeat: Infinity, 
      ease: "linear" 
    }}
    className="absolute text-red-500/20 pointer-events-none"
  >
    <Heart size={24} fill="currentColor" />
  </motion.div>
);

const LOADING_MESSAGES = [
  "Inspecting Sound Systems...",
  "Synchronizing 3D Assets...",
  "Calibrating Particles...",
  "Ready for Asha"
];

export default function Preloader({ isReady, onEnter }) {
  const [percent, setPercent] = useState(0);
  
  const [hearts] = useState(() => [...Array(20)].map((_, i) => ({
    id: i,
    delay: Math.random() * 2, 
    x: Math.random() * 100,
    initialY: i < 10 ? `${Math.random() * 100}vh` : '110vh', 
    size: 0.5 + Math.random() * 1.5,
    duration: 5 + Math.random() * 7 
  })));

  // Accurately transition messages: 0-25, 25-50, 50-75, 75-100
  const messageIndex = Math.min(
    Math.floor((percent / 25.1)), 
    LOADING_MESSAGES.length - 1
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 90 && !isReady) return 90;
        
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onEnter, 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 30); 

    return () => clearInterval(interval);
  }, [isReady, onEnter]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Background Rising Hearts */}
      {hearts.map(heart => (
        <RisingHeart key={heart.id} {...heart} />
      ))}

      {/* Atmospheric Vignette */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      <div className="relative flex flex-col items-center z-10 transition-all duration-700">
        {/* Pulsating Center Glow */}
        <motion.div
           animate={{ 
             scale: [1, 1.2, 1],
             opacity: [0.1, 0.25, 0.1]
           }}
           transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
           className="absolute w-96 h-96 bg-red-600/10 rounded-full blur-[100px]"
        />

        <div className="mb-2">
           <ShinyText
            text="Asha"
            speed={2.5}
            color="#ffffff50"
            shineColor="#ffffff"
            className="text-5xl md:text-7xl font-serif tracking-[0.2em] uppercase"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center w-full"
        >
          {/* Progress Indicator */}
          <div className="mt-8 flex flex-col items-center w-full px-6">
            <div className="w-64 h-[1px] bg-white/5 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-y-0 left-0 bg-white/60 shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="mt-6 flex flex-col items-center overflow-hidden h-12">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={LOADING_MESSAGES[messageIndex] + (percent === 100 ? '-done' : '')}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-brand-white/30 text-[10px] tracking-[0.6em] uppercase font-light text-center"
                >
                  {percent === 100 ? "Ready for Asha" : LOADING_MESSAGES[messageIndex]} 
                  <span className="text-white/60 ml-2">{percent}%</span>
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
