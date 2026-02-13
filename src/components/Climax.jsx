import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// Pre-calculate star data outside component for strict purity
const STARS_DATA = [...Array(30)].map((_, i) => ({
  id: i,
  x: (Math.random() - 0.5) * 1200,
  yStart: 800,
  opacity: 0.1 + Math.random() * 0.4,
  duration: 8 + Math.random() * 12,
  delay: Math.random() * 6
}));

const STAGES = {
  VALENTINE: 'VALENTINE',
  TREADLOCK: 'TREADLOCK',
  ROMANTIC: 'ROMANTIC',
  VOID: 'VOID',
  END: 'END'
};

export default function Climax() {
  const [stage, setStage] = useState(STAGES.VALENTINE);
  const ref = React.useRef(null);
  const sequenceStarted = React.useRef(false);
  const isInView = useInView(ref, { amount: 0.95 }); // Strict lock

  useEffect(() => {
    if (!isInView) {
      if (sequenceStarted.current) {
        sequenceStarted.current = false;
        setTimeout(() => setStage(STAGES.VALENTINE), 0);
        window.dispatchEvent(new CustomEvent('unlock-scroll'));
      }
      return;
    }

    if (sequenceStarted.current) return;
    sequenceStarted.current = true;

    // LOCK SCROLL
    window.dispatchEvent(new CustomEvent('lock-scroll'));

    // Ultra-Snappy Sequence timing: 1.2s - 1.5s
    const timers = [
      setTimeout(() => setStage(STAGES.TREADLOCK), 1200),
      setTimeout(() => setStage(STAGES.ROMANTIC), 2500),
      setTimeout(() => setStage(STAGES.VOID), 3800), // Everything fades FASTER
      setTimeout(() => setStage(STAGES.END), 4100), // Trigger loop reset FASTER
    ];

    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  useEffect(() => {
    if (stage === STAGES.END) {
      // START DOWNWARD LOOP RESET
      window.dispatchEvent(new CustomEvent('unlock-scroll'));
      
      // Scroll to the absolute bottom (where Heart has morphed back)
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      
      // After scroll reaches bottom, jump to top silently
      const timer = setTimeout(() => {
        window.scrollTo(0, 0); // Jump to top
        setStage(STAGES.VALENTINE);
        sequenceStarted.current = false;
      }, 1500); // Shorter wait for jump
      
      return () => clearTimeout(timer);
    }
  }, [stage]);

  return (
    <section ref={ref} className="relative z-10 h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden select-none">
      {/* Background Glow */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.15 }}
        transition={{ duration: 3 }}
        className="absolute w-[80vw] h-[80vw] bg-red-600 rounded-full blur-[150px] -z-10"
      />

      <div className="text-center px-4 w-full max-w-5xl relative min-h-[500px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {stage === STAGES.VALENTINE && (
            <motion.div
              key="valentine"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center p-4"
            >
              <h1 className="text-[clamp(2.5rem,10vw,6rem)] font-serif text-brand-white drop-shadow-2xl brightness-125 mb-4 md:mb-6 leading-tight">
                Happy Valentine's Day
              </h1>
              <div className="h-px w-24 md:w-32 bg-white/30 mx-auto mb-6 md:mb-8 origin-center" />
              <p className="text-[clamp(1rem,4vw,2rem)] font-light text-brand-white/40 tracking-[0.2em] md:tracking-[0.3em] uppercase italic">
                ...from your friend
              </p>
            </motion.div>
          )}

          {stage === STAGES.TREADLOCK && (
            <motion.div
              key="treadlock"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-4"
            >
              <h2 className="text-[clamp(3.5rem,15vw,9rem)] font-serif text-brand-white/80 tracking-tighter uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] leading-none">
                TREADLOCK
              </h2>
            </motion.div>
          )}

          {stage === STAGES.ROMANTIC && (
            <motion.div
              key="romantic"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.8 } }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-4"
            >
              <p className="text-[clamp(1.2rem,5vw,3rem)] font-light text-brand-white text-center leading-snug">
                "Who says Devs can't be <br/> <span className="text-red-500 font-serif italic font-bold">romantic😎?</span>"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Stars Float-up */}
      {STARS_DATA.map((star) => (
        <motion.div
           key={star.id}
           initial={{ 
             x: star.x, 
             y: star.yStart, 
             opacity: star.opacity 
           }}
           animate={{ 
             y: -600, 
             opacity: 0 
           }}
           transition={{ 
             duration: star.duration, 
             repeat: Infinity, 
             delay: star.delay 
           }}
           className="absolute w-1 h-1 bg-white rounded-full"
        />
      ))}
    </section>
  );
}
