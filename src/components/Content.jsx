import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Section = ({ children, opacity, y, display, isIntro = false, isLoaded = true }) => {
  // Snappy entrance for Section 1 text
  const introProps = isIntro ? {
    initial: { opacity: 0, y: 30 },
    animate: isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    transition: { duration: 1.2, delay: 0.1, ease: "easeOut" }
  } : {};

  return (
    <motion.div 
      style={{ opacity, y, display }}
      className="absolute inset-x-0 bottom-0 pb-12 flex flex-col items-center justify-end text-center pointer-events-none"
    >
      <motion.div {...introProps} className="flex flex-col items-center">
        {children}
      </motion.div>
    </motion.div>
  );
};

export default function Content({ isLoaded }) {
  const { scrollYProgress } = useScroll();

  /**
   * STRICT SCROLL MAPPING:
   * 0.0 - 0.1: For Asha (Heart phase)
   * 0.15 - 0.55: Rose Phase
   * 0.65 - 0.95: Name Phase (EXTENDED)
   */

  // 1. "For Asha" (Symmetry: Fade in at 0.0, Fade out at 0.1, Fade back in at 0.96)
  const opacity1 = useTransform(scrollYProgress, [0.0, 0.05, 0.1, 0.95, 0.98, 1.0], [1, 1, 0, 0, 1, 1], { clamp: true });
  const y1 = useTransform(scrollYProgress, [0.0, 0.1, 0.95, 1.0], [0, -30, 30, 0], { clamp: true });
  const display1 = useTransform(scrollYProgress, v => (v >= 0.12 && v <= 0.92) ? 'none' : 'flex');

  // 2. "A Rose For You"
  const opacity2 = useTransform(scrollYProgress, [0.12, 0.2, 0.5, 0.6], [0, 1, 1, 0], { clamp: true });
  const y2 = useTransform(scrollYProgress, [0.12, 0.6], [30, -30], { clamp: true });
  const display2 = useTransform(scrollYProgress, v => (v < 0.1 || v > 0.65) ? 'none' : 'flex');

  // 3. "Always Supportive & Kind" (Fade out before Climax)
  const opacity3 = useTransform(scrollYProgress, [0.58, 0.68, 0.85, 0.9], [0, 1, 1, 0], { clamp: true });
  const y3 = useTransform(scrollYProgress, [0.58, 0.9], [30, -30], { clamp: true });
  const display3 = useTransform(scrollYProgress, v => (v < 0.55 || v > 0.92) ? 'none' : 'flex');

  return (
    <div className="fixed inset-0 z-10 pointer-events-none select-none font-sans overflow-hidden">
      {isLoaded && (
        <React.Fragment>
          <Section opacity={opacity1} y={y1} display={display1} isIntro={true} isLoaded={isLoaded}>
            <h1 className="text-3xl md:text-5xl font-serif text-brand-white drop-shadow-2xl tracking-wide uppercase">
              For Asha
            </h1>
            <p className="mt-2 text-base md:text-xl text-brand-white/40 uppercase tracking-[0.5em] font-light italic">
              To a wonderful friend
            </p>
          </Section>

          <Section opacity={opacity2} y={y2} display={display2}>
            <h1 className="text-2xl md:text-4xl font-serif text-blue-400 drop-shadow-md">
              A Rose For You
            </h1>
            <p className="mt-4 max-w-lg mx-auto text-sm md:text-lg text-brand-white/60 px-8 font-light leading-relaxed">
              "Celebrating a friendship that <br/> blooms more every day."
            </p>
          </Section>

          <Section opacity={opacity3} y={y3} display={display3}>
            <h1 className="text-4xl md:text-6xl font-serif text-brand-white/90 uppercase tracking-tighter mb-2">
              Always
            </h1>
            <div className="h-px w-16 bg-white/10 mb-4" />
            <p className="text-base md:text-xl font-light text-brand-white/40 tracking-[0.3em] uppercase">
              Supportive & Kind
            </p>
          </Section>
        </React.Fragment>
      )}
    </div>
  );
}
