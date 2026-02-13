import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const HeroContent = ({ isEntering }) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Global Exit Fade (Fade out content when scrolling into Projects)
    const containerOpacity = useTransform(scrollYProgress, [0.9, 1.0], [1, 0]);

    // Typography Scroll Transform Logic
    const textOpacity = useTransform(scrollYProgress, [0.05, 0.15], [1, 0]);
    const textBlurTransform = useTransform(scrollYProgress, [0.05, 0.15], ["blur(0px)", "blur(10px)"]);
    const textScaleTransform = useTransform(scrollYProgress, [0.05, 0.15], [1, 1.1]);

    // HUD Scroll Transform Logic
    const hudOpacityTransform = useTransform(scrollYProgress, [0.2, 0.25, 0.9, 1.0], [0, 1, 1, 0]);

    return (
        <div ref={containerRef} className="relative h-[800vh] w-full">
            
            {/* --- PERMANENT HUD / BLUEPRINT ELEMENTS --- */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: isEntering ? 0 : 1 }}
                transition={{ duration: 1.5, delay: 2.6, ease: "easeOut" }}
                className="fixed inset-0 z-20 pointer-events-none p-6 md:p-12 mix-blend-difference"
            >
                <motion.div style={{ opacity: hudOpacityTransform }} className="w-full h-full relative">
                    {/* Corner Frame Accents */}
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: isEntering ? 0.8 : 1, opacity: isEntering ? 0 : 1 }}
                      transition={{ duration: 0.8, delay: 1.8 }}
                      className="absolute top-16 left-12 w-12 h-px bg-white/20" 
                    />
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: isEntering ? 0.8 : 1, opacity: isEntering ? 0 : 1 }}
                      transition={{ duration: 0.8, delay: 1.8 }}
                      className="absolute top-16 left-12 w-px h-12 bg-white/20" 
                    />
                    
                    {/* Coordinate Markers */}
                    <motion.div 
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: isEntering ? 20 : 0, opacity: isEntering ? 0 : 1 }}
                      transition={{ duration: 1, delay: 2.0 }}
                      className="absolute top-16 right-12 text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase"
                    >
                        Ref: 01_ALCH_PRIME
                    </motion.div>
                    
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: isEntering ? 20 : 0, opacity: isEntering ? 0 : 1 }}
                      transition={{ duration: 1, delay: 2.2 }}
                      className="absolute bottom-1 left-12 flex flex-col gap-2"
                    >
                        <div className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase">
                            Structure: Variable
                        </div>
                        <div className="w-32 h-px bg-white/10" />
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isEntering ? 0 : 1 }}
                      transition={{ duration: 1, delay: 2.4 }}
                      className="absolute bottom-1 right-12 text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase"
                    >
                        Status: Transmuting...
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* --- FIXED CONTENT OVERLAY (LOCKED TO VIEWPORT) --- */}
            <motion.div 
                style={{ opacity: containerOpacity }}
                className="fixed top-0 left-0 h-screen w-full flex items-center justify-start overflow-hidden pointer-events-none"
            >
                
                <div className="relative w-full flex flex-col items-start pl-4 md:pl-8">
                    
                    <div className="w-full flex flex-col items-start text-left">
                        
                    {/* Stage 1: Prima Materia */}
                    <motion.div 
                        style={{ 
                            opacity: textOpacity,
                            filter: textBlurTransform,
                            scale: textScaleTransform
                        }}
                        className="absolute flex flex-col items-start origin-left"
                    >
                        <motion.span 
                            initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
                            animate={{ 
                              y: isEntering ? 20 : 0, 
                              opacity: isEntering ? 0 : 1,
                              filter: isEntering ? "blur(10px)" : "blur(0px)"
                            }}
                            transition={{ duration: 1, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
                            className="font-mono text-[10px] tracking-[0.8em] text-brand-white/30 uppercase mb-4"
                        >
                            Phase_01 // Raw Essence
                        </motion.span>
                        
                        <motion.h1 
                            initial={{ y: 40, opacity: 0, filter: "blur(20px)" }}
                            animate={{ 
                              y: isEntering ? 40 : 0, 
                              opacity: isEntering ? 0 : 1,
                              filter: isEntering ? "blur(20px)" : "blur(0px)"
                            }}
                            transition={{ duration: 1.4, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
                            className="font-pdark-custom text-6xl md:text-[8vw] leading-[0.9] tracking-[0.05em] mb-6 uppercase text-brand-white"
                        >
                            Prima<br/>Materia
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: isEntering ? 20 : 0, opacity: isEntering ? 0 : 1 }}
                            transition={{ duration: 1.2, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
                            className="font-sans text-xs md:text-sm tracking-wider text-brand-white/40 uppercase max-w-sm leading-relaxed border-l border-white/10 pl-4 py-1"
                        >
                            The raw essence of digital potential. Chaotic, formless, and waiting for the alchemist's touch.
                        </motion.p>
                    </motion.div>

                    </div>
                </div>

                {/* Vertical Progress Rail (Right Side) */}
                <motion.div 
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: isEntering ? 0 : 1, opacity: isEntering ? 0 : 1 }}
                    transition={{ duration: 1.5, delay: 2.6 }}
                    className="absolute right-12 top-1/2 -translate-y-1/2 w-px h-32 bg-white/5 hidden md:block"
                >
                    <motion.div 
                        style={{ scaleY: scrollYProgress, originY: 0 }}
                        className="w-full h-full bg-white/40"
                    />
                </motion.div>

            </motion.div>
        </div>
    );
};

export default HeroContent;
